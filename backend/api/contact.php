<?php

set_exception_handler(function(Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});

require_once __DIR__ . '/../middleware/helpers.php';
require_once __DIR__ . '/../config/email.php';

requireMethod('POST');
$body = getBody();
$pdo  = getDB();

$name    = clean($body['name']    ?? '');
$email   = filter_var(trim($body['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = clean($body['phone']   ?? '');
$subject = clean($body['subject'] ?? '');
$reason  = clean($body['reason']  ?? '');
$message = clean($body['message'] ?? '');

if (!$name)    sendError('Name is required.');
if (!$email)   sendError('A valid email address is required.');
if (!$subject) sendError('Subject is required.');
if (!$message) sendError('Message is required.');

// Attach to logged-in user if any
$userId = null;
if (!empty($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
} else {
    $headers = getallheaders();
    $token   = $headers['X-Auth-Token'] ?? $headers['x-auth-token'] ?? '';
    if ($token) {
        $s = $pdo->prepare("SELECT id FROM users WHERE auth_token = ? LIMIT 1");
        $s->execute([$token]);
        $u = $s->fetch();
        if ($u) $userId = (int) $u['id'];
    }
}

// Save to database
$stmt = $pdo->prepare(
    "INSERT INTO contacts (user_id, name, email, phone, subject, reason, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([$userId, $name, $email, $phone, $subject, $reason, $message]);

// Send admin notification email (wrapped — mail failure won't break the response)
$adminHtml = contactNotificationTemplate($name, $email, $phone ?: 'N/A', $subject, $reason ?: 'N/A', $message);
@sendMail(ADMIN_EMAIL, "New Contact: {$subject}", $adminHtml);

// Send auto-reply to the sender
$autoReplyHtml = contactAutoReplyTemplate($name);
@sendMail($email, 'We received your message – DiscoverLanka', $autoReplyHtml);

sendSuccess([], 'Your message has been sent successfully. We will get back to you soon!');
