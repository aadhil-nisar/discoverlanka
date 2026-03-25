<?php
// ============================================================
// backend/api/profile.php
// GET  /api/profile.php          → get profile
// POST /api/profile.php          → update profile
// POST /api/profile.php?action=change_password
// ============================================================

require_once __DIR__ . '/../middleware/helpers.php';

$action = $_GET['action'] ?? 'profile';
$auth   = requireAuth();
$pdo    = getDB();

// ── GET PROFILE ───────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare(
        "SELECT id, first_name, last_name, email, phone, country, bio, avatar_url, created_at
         FROM users WHERE id = ? LIMIT 1"
    );
    $stmt->execute([$auth['id']]);
    $user = $stmt->fetch();

    $itin = $pdo->prepare("SELECT COUNT(*) FROM saved_itineraries WHERE user_id = ?");
    $itin->execute([$auth['id']]);

    $revs = $pdo->prepare("SELECT COUNT(*) FROM reviews WHERE user_id = ?");
    $revs->execute([$auth['id']]);

    sendSuccess([
        'user' => array_merge($user, [
            'id'              => (int) $user['id'],
            'itinerary_count' => (int) $itin->fetchColumn(),
            'review_count'    => (int) $revs->fetchColumn(),
        ]),
    ]);
}

// ── UPDATE PROFILE ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'profile') {
    $body = getBody();

    $firstName = clean($body['first_name'] ?? '');
    $lastName  = clean($body['last_name']  ?? '');
    $phone     = clean($body['phone']      ?? '');
    $country   = clean($body['country']    ?? '');
    $bio       = clean($body['bio']        ?? '');
    $avatarUrl = clean($body['avatar_url'] ?? '');

    if (!$firstName || !$lastName) sendError('First and last name are required.');

    $pdo->prepare(
        "UPDATE users SET first_name=?, last_name=?, phone=?, country=?, bio=?, avatar_url=?
         WHERE id=?"
    )->execute([$firstName, $lastName, $phone, $country, $bio, $avatarUrl ?: null, $auth['id']]);

    sendSuccess([], 'Profile updated successfully.');
}

// ── CHANGE PASSWORD ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'change_password') {
    $body    = getBody();
    $current = $body['current_password'] ?? '';
    $newPass = $body['new_password']     ?? '';

    if (!$current || !$newPass)    sendError('Both current and new password are required.');
    if (strlen($newPass) < 6)      sendError('New password must be at least 6 characters.');

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$auth['id']]);
    $user = $stmt->fetch();

    if (!password_verify($current, $user['password'])) {
        sendError('Current password is incorrect.');
    }

    $hash = password_hash($newPass, PASSWORD_BCRYPT);
    $pdo->prepare("UPDATE users SET password=? WHERE id=?")->execute([$hash, $auth['id']]);

    sendSuccess([], 'Password changed successfully.');
}

sendError('Invalid request.', 405);
