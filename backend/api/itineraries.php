<?php
// ============================================================
// backend/api/itineraries.php
// GET    /api/itineraries.php          → list user's itineraries
// POST   /api/itineraries.php          → save new itinerary
// DELETE /api/itineraries.php?id=X     → delete itinerary
// ============================================================

require_once __DIR__ . '/../middleware/helpers.php';

$auth = requireAuth();
$pdo  = getDB();

// ── LIST SAVED ITINERARIES ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare(
        "SELECT id, title, type, created_at FROM saved_itineraries
         WHERE user_id = ? ORDER BY created_at DESC"
    );
    $stmt->execute([$auth['id']]);
    sendSuccess(['itineraries' => $stmt->fetchAll()]);
}

// ── SAVE ITINERARY ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body  = getBody();
    $title = clean($body['title'] ?? '');
    $type  = in_array($body['type'] ?? '', ['ai', 'manual']) ? $body['type'] : 'manual';
    $data  = json_encode($body['data'] ?? []);

    if (!$title)    sendError('Itinerary title is required.');
    if (!$data)     sendError('Itinerary data is missing.');

    // Limit: max 20 saved itineraries per user
    $count = $pdo->prepare("SELECT COUNT(*) FROM saved_itineraries WHERE user_id = ?");
    $count->execute([$auth['id']]);
    if ((int)$count->fetchColumn() >= 20) {
        sendError('You can save up to 20 itineraries. Please delete old ones first.');
    }

    $stmt = $pdo->prepare(
        "INSERT INTO saved_itineraries (user_id, title, type, data) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$auth['id'], $title, $type, $data]);

    sendSuccess(['id' => (int) $pdo->lastInsertId()], 'Itinerary saved successfully!');
}

// ── DELETE ITINERARY ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) sendError('Itinerary ID is required.');

    $stmt = $pdo->prepare(
        "DELETE FROM saved_itineraries WHERE id = ? AND user_id = ? LIMIT 1"
    );
    $stmt->execute([$id, $auth['id']]);

    if ($stmt->rowCount() === 0) sendError('Itinerary not found or access denied.', 404);

    sendSuccess([], 'Itinerary deleted.');
}

sendError('Method not allowed.', 405);
