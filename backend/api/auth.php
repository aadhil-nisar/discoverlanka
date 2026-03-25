<?php
// ============================================================
// backend/api/auth.php
// POST /api/auth.php?action=register
// POST /api/auth.php?action=verify_email
// POST /api/auth.php?action=resend_verification
// POST /api/auth.php?action=login
// POST /api/auth.php?action=logout
// POST /api/auth.php?action=forgot_password
// POST /api/auth.php?action=reset_password
// GET  /api/auth.php?action=me
// ============================================================

// Global error handler: always return clean JSON, never raw PHP errors
set_exception_handler(function(Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});
set_error_handler(function($errno, $errstr) {
    throw new ErrorException($errstr, $errno);
});

require_once __DIR__ . '/../middleware/helpers.php';
require_once __DIR__ . '/../config/email.php';

$action = $_GET['action'] ?? '';

switch ($action) {

    // ── REGISTER ──────────────────────────────────────────────
    case 'register':
        requireMethod('POST');
        $body = getBody();

        $firstName = clean($body['first_name'] ?? '');
        $lastName  = clean($body['last_name']  ?? '');
        $email     = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password  = $body['password'] ?? '';

        if (!$firstName || !$lastName) sendError('First and last name are required.');
        if (!$email)                   sendError('A valid email address is required.');
        if (strlen($password) < 6)     sendError('Password must be at least 6 characters.');

        $pdo = getDB();

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        if ($stmt->fetch()) sendError('This email address is already registered.');

        $hash  = password_hash($password, PASSWORD_BCRYPT);
        $token = bin2hex(random_bytes(32));

        $stmt = $pdo->prepare(
            "INSERT INTO users (first_name, last_name, email, password, auth_token, email_verified)
             VALUES (?, ?, ?, ?, ?, 1)"
        );
        $stmt->execute([$firstName, $lastName, $email, $hash, $token]);
        $userId = (int) $pdo->lastInsertId();

        $_SESSION['user_id']    = $userId;
        $_SESSION['user_email'] = $email;

        sendSuccess([
            'user'             => [
                'id'             => $userId,
                'first_name'     => $firstName,
                'last_name'      => $lastName,
                'email'          => $email,
                'avatar_url'     => null,
                'email_verified' => true,
            ],
            'token'            => $token,
            'needs_verification' => false,
        ], 'Account created! Welcome to DiscoverLanka!');
        break;

    // ── VERIFY EMAIL ──────────────────────────────────────────
    case 'verify_email':
        requireMethod('POST');
        $body   = getBody();
        $userId = (int) ($body['user_id'] ?? 0);
        $code   = trim($body['code'] ?? '');

        if (!$userId || !$code) sendError('User ID and code are required.');

        $pdo  = getDB();
        $stmt = $pdo->prepare(
            "SELECT * FROM email_verifications
             WHERE user_id = ? AND token = ? AND used = 0 AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1"
        );
        $stmt->execute([$userId, $code]);
        $row = $stmt->fetch();

        if (!$row) sendError('Invalid or expired verification code.');

        // Mark used
        $pdo->prepare("UPDATE email_verifications SET used = 1 WHERE id = ?")->execute([$row['id']]);
        $pdo->prepare("UPDATE users SET email_verified = 1 WHERE id = ?")->execute([$userId]);

        // Refresh token
        $newToken = bin2hex(random_bytes(32));
        $pdo->prepare("UPDATE users SET auth_token = ? WHERE id = ?")->execute([$newToken, $userId]);

        $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
        $userStmt->execute([$userId]);
        $user = $userStmt->fetch();

        sendSuccess([
            'user'  => [
                'id'             => (int) $user['id'],
                'first_name'     => $user['first_name'],
                'last_name'      => $user['last_name'],
                'email'          => $user['email'],
                'avatar_url'     => $user['avatar_url'],
                'email_verified' => true,
            ],
            'token' => $newToken,
        ], 'Email verified successfully! Welcome to DiscoverLanka!');
        break;

    // ── RESEND VERIFICATION ───────────────────────────────────
    case 'resend_verification':
        requireMethod('POST');
        $body   = getBody();
        $userId = (int) ($body['user_id'] ?? 0);
        if (!$userId) sendError('User ID is required.');

        $pdo  = getDB();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) sendError('User not found.');
        if ($user['email_verified']) sendError('Email is already verified.');

        // Invalidate old codes
        $pdo->prepare("UPDATE email_verifications SET used = 1 WHERE user_id = ?")->execute([$userId]);

        $code      = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = date('Y-m-d H:i:s', time() + 900);
        $pdo->prepare(
            "INSERT INTO email_verifications (user_id, email, token, expires_at) VALUES (?, ?, ?, ?)"
        )->execute([$userId, $user['email'], $code, $expiresAt]);

        $html = emailVerificationTemplate($user['first_name'], $code);
        @sendMail($user['email'], 'Your new DiscoverLanka verification code', $html);

        sendSuccess([], 'A new verification code has been sent to your email.');
        break;

    // ── LOGIN ─────────────────────────────────────────────────
    case 'login':
        requireMethod('POST');
        $body  = getBody();
        $email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $pass  = $body['password'] ?? '';

        if (!$email || !$pass) sendError('Email and password are required.');

        $pdo  = getDB();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($pass, $user['password'])) {
            sendError('Incorrect email or password.', 401);
        }

        $token = bin2hex(random_bytes(32));
        $pdo->prepare("UPDATE users SET auth_token = ? WHERE id = ?")->execute([$token, $user['id']]);

        $_SESSION['user_id']    = $user['id'];
        $_SESSION['user_email'] = $user['email'];

        sendSuccess([
            'user'  => [
                'id'             => (int) $user['id'],
                'first_name'     => $user['first_name'],
                'last_name'      => $user['last_name'],
                'email'          => $user['email'],
                'avatar_url'     => $user['avatar_url'],
                'phone'          => $user['phone'],
                'country'        => $user['country'],
                'bio'            => $user['bio'],
                'email_verified' => true,
            ],
            'token'            => $token,
            'needs_verification' => false,
        ], 'Login successful. Welcome back!');
        break;

    // ── LOGOUT ────────────────────────────────────────────────
    case 'logout':
        requireMethod('POST');
        if (!empty($_SESSION['user_id'])) {
            getDB()->prepare("UPDATE users SET auth_token = NULL WHERE id = ?")
                   ->execute([$_SESSION['user_id']]);
        }
        session_destroy();
        sendSuccess([], 'Logged out successfully.');
        break;

    // ── FORGOT PASSWORD ───────────────────────────────────────
    case 'forgot_password':
        requireMethod('POST');
        $body  = getBody();
        $email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        if (!$email) sendError('A valid email address is required.');

        $pdo  = getDB();
        $stmt = $pdo->prepare("SELECT id, first_name FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        // Always return success to prevent email enumeration
        if ($user) {
            $resetToken = bin2hex(random_bytes(32));
            $expiresAt  = date('Y-m-d H:i:s', time() + 3600); // 1 hour

            // Remove old tokens
            $pdo->prepare("UPDATE password_resets SET used = 1 WHERE email = ?")->execute([$email]);

            $pdo->prepare(
                "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)"
            )->execute([$email, $resetToken, $expiresAt]);

            $resetUrl = SITE_URL . "/signin.html?action=reset&token={$resetToken}&email=" . urlencode($email);
            $html     = passwordResetTemplate($user['first_name'], $resetUrl);
            @sendMail($email, 'Reset your DiscoverLanka password', $html);
        }

        sendSuccess([], 'If that email is registered, you will receive a reset link shortly.');
        break;

    // ── RESET PASSWORD ────────────────────────────────────────
    case 'reset_password':
        requireMethod('POST');
        $body     = getBody();
        $email    = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $token    = trim($body['token']    ?? '');
        $password = $body['password'] ?? '';

        if (!$email || !$token)     sendError('Invalid reset request.');
        if (strlen($password) < 6)  sendError('Password must be at least 6 characters.');

        $pdo  = getDB();
        $stmt = $pdo->prepare(
            "SELECT * FROM password_resets
             WHERE email = ? AND token = ? AND used = 0 AND expires_at > NOW()
             LIMIT 1"
        );
        $stmt->execute([$email, $token]);
        $reset = $stmt->fetch();

        if (!$reset) sendError('This reset link is invalid or has expired. Please request a new one.');

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $pdo->prepare("UPDATE users SET password = ? WHERE email = ?")->execute([$hash, $email]);
        $pdo->prepare("UPDATE password_resets SET used = 1 WHERE id = ?")->execute([$reset['id']]);

        sendSuccess([], 'Your password has been reset successfully. You can now sign in.');
        break;

    // ── GET CURRENT USER ──────────────────────────────────────
    case 'me':
        requireMethod('GET');
        $auth = requireAuth();
        $pdo  = getDB();
        $stmt = $pdo->prepare(
            "SELECT id, first_name, last_name, email, phone, country, bio, avatar_url, email_verified, created_at
             FROM users WHERE id = ? LIMIT 1"
        );
        $stmt->execute([$auth['id']]);
        $user = $stmt->fetch();
        if (!$user) sendError('User not found.', 404);

        $itin = $pdo->prepare("SELECT COUNT(*) FROM saved_itineraries WHERE user_id = ?");
        $itin->execute([$auth['id']]);

        $revs = $pdo->prepare("SELECT COUNT(*) FROM reviews WHERE user_id = ?");
        $revs->execute([$auth['id']]);

        sendSuccess([
            'user' => array_merge($user, [
                'id'               => (int) $user['id'],
                'email_verified'   => (bool) $user['email_verified'],
                'itinerary_count'  => (int) $itin->fetchColumn(),
                'review_count'     => (int) $revs->fetchColumn(),
            ]),
        ]);
        break;

    default:
        sendError('Unknown action.', 404);
}
