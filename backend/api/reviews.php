<?php
// ============================================================
// backend/api/reviews.php
// GET    /api/reviews.php            → list all approved reviews
// GET    /api/reviews.php?my=1       → list current user's reviews
// POST   /api/reviews.php            → submit a review
// DELETE /api/reviews.php?id=X       → delete own review (auth)
// ============================================================

require_once __DIR__ . '/../middleware/helpers.php';

$pdo = getDB();

// ── LIST REVIEWS ──────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $myOnly = ($_GET['my'] ?? '') === '1';

    if ($myOnly) {
        $auth   = requireAuth();
        $stmt   = $pdo->prepare(
            "SELECT id, user_id, name, destination, travel_type, visit_time, title, review_text, rating, created_at
             FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
        );
        $stmt->execute([$auth['id']]);
    } else {
        $minRating = max(1, min(5, (int) ($_GET['min_rating'] ?? 1)));
        $stmt      = $pdo->prepare(
            "SELECT id, name, destination, travel_type, visit_time, title, review_text, rating, created_at
             FROM reviews WHERE approved = 1 AND rating >= ? ORDER BY created_at DESC LIMIT 100"
        );
        $stmt->execute([$minRating]);
    }

    sendSuccess(['reviews' => $stmt->fetchAll()]);
}

// ── SUBMIT REVIEW ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getBody();

    $name       = clean($body['name']        ?? '');
    $dest       = clean($body['destination'] ?? '');
    $travelType = clean($body['travel_type'] ?? '');
    $visitTime  = clean($body['visit_time']  ?? '');
    $title      = clean($body['title']       ?? '');
    $text       = clean($body['review_text'] ?? '');
    $rating     = (int) ($body['rating']     ?? 0);

    if (!$name)                      sendError('Name is required.');
    if (!$dest)                      sendError('Destination is required.');
    if (!$title)                     sendError('Review title is required.');
    if (!$text)                      sendError('Review text is required.');
    if ($rating < 1 || $rating > 5) sendError('Rating must be between 1 and 5.');

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

    $stmt = $pdo->prepare(
        "INSERT INTO reviews (user_id, name, destination, travel_type, visit_time, title, review_text, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$userId, $name, $dest, $travelType, $visitTime, $title, $text, $rating]);

    sendSuccess(['id' => (int) $pdo->lastInsertId()], 'Review submitted successfully!');
}

// ── DELETE OWN REVIEW ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $auth = requireAuth();
    $id   = (int) ($_GET['id'] ?? 0);
    if (!$id) sendError('Review ID is required.');

    $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$id, $auth['id']]);

    if ($stmt->rowCount() === 0) sendError('Review not found or access denied.', 404);
    sendSuccess([], 'Review deleted.');
}

sendError('Method not allowed.', 405);
