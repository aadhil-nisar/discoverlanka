<?php
// ============================================================
// backend/middleware/helpers.php — Shared helpers
// ============================================================

require_once __DIR__ . '/../config/db.php';

// ── CORS ─────────────────────────────────────────────────────
// Allow requests from your frontend origin.
// During development with XAMPP/WAMP this is fine as-is.
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── SESSION ──────────────────────────────────────────────────
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ── RESPONSE HELPERS ────────────────────────────────────────
function sendJSON(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function sendError(string $message, int $code = 400): void {
    sendJSON(['success' => false, 'message' => $message], $code);
}

function sendSuccess(array $data = [], string $message = 'OK'): void {
    sendJSON(array_merge(['success' => true, 'message' => $message], $data));
}

// ── INPUT HELPERS ────────────────────────────────────────────
function getBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function requireMethod(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        sendError('Method not allowed.', 405);
    }
}

// ── AUTH GUARD ───────────────────────────────────────────────
// Call this at the top of any endpoint that needs a logged-in user.
function requireAuth(): array {
    // Check session first
    if (!empty($_SESSION['user_id'])) {
        return ['id' => $_SESSION['user_id'], 'email' => $_SESSION['user_email']];
    }
    // Also accept token in Authorization header (for JS fetch)
    $headers = getallheaders();
    $token   = $headers['X-Auth-Token'] ?? $headers['x-auth-token'] ?? '';
    if ($token) {
        $pdo  = getDB();
        $stmt = $pdo->prepare("SELECT id, email FROM users WHERE auth_token = ? LIMIT 1");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        if ($user) return $user;
    }
    sendError('Unauthorised. Please log in.', 401);
}

// ── SANITISE ─────────────────────────────────────────────────
function clean(string $str): string {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8');
}
