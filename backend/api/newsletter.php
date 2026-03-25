<?php
// ============================================================
// backend/api/newsletter.php
// POST /api/newsletter.php  → subscribe email
// ============================================================

require_once __DIR__ . '/../middleware/helpers.php';

requireMethod('POST');
$body  = getBody();
$email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$email) sendError('A valid email address is required.');

$pdo  = getDB();
$stmt = $pdo->prepare("SELECT id FROM newsletter WHERE email = ? LIMIT 1");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    sendSuccess([], 'You are already subscribed to DiscoverLanka!');
}

$pdo->prepare("INSERT INTO newsletter (email) VALUES (?)")->execute([$email]);
sendSuccess([], 'Thank you for subscribing to DiscoverLanka!');
