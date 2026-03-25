<?php
// ============================================================
// backend/api/ai-plan-trip.php
// POST /backend/api/ai-plan-trip.php
// ============================================================

header('Content-Type: application/json; charset=utf-8');

set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
    exit;
});

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

require_once __DIR__ . '/../middleware/helpers.php';
require_once __DIR__ . '/../config/ai.php';

requireMethod('POST');
$body = getBody();

$start         = clean($body['start'] ?? '');
$destination   = clean($body['destination'] ?? '');
$days          = (int)($body['days'] ?? 0);
$travelers     = clean($body['travelers'] ?? '');
$style         = clean($body['style'] ?? '');
$transport     = clean($body['transport'] ?? '');
$budgetLevel   = clean($body['budgetLevel'] ?? '');
$accommodation = clean($body['accommodation'] ?? '');
$interests     = implode(', ', array_map('clean', (array)($body['interests'] ?? [])));
$foodPref      = clean($body['foodPreference'] ?? '');
$pace          = clean($body['pace'] ?? '');
$mustInclude   = clean($body['mustInclude'] ?? '');
$avoid         = clean($body['avoid'] ?? '');

if (
    !$start ||
    !$destination ||
    !$days ||
    !$travelers ||
    !$style ||
    !$transport ||
    !$budgetLevel ||
    !$accommodation
) {
    sendError('Missing required fields.', 400);
}

if ($start === $destination) {
    sendError('Starting point and destination cannot be the same.', 400);
}

$apiKey = defined('GEMINI_API_KEY') ? trim(GEMINI_API_KEY) : '';
$model  = defined('GEMINI_MODEL') ? trim(GEMINI_MODEL) : 'gemini-2.5-flash';

if (!$apiKey || $apiKey === 'AIzaSyBuEmMf1HX78Rufbcb9kJSVrbt6_UoTaRc') {
    sendError('AI is not configured yet. Add your real Gemini API key in backend/config/ai.php', 500);
}

$prompt = "You are an expert Sri Lanka travel planner.

Create a detailed, realistic Sri Lanka trip itinerary in VALID JSON only.

TRIP DETAILS:
- Starting Point: {$start}
- Main Destination: {$destination}
- Duration: {$days} days
- Travelers: {$travelers}
- Travel Style: {$style}
- Transport Mode: {$transport}
- Budget Level: {$budgetLevel}
- Accommodation: {$accommodation}
- Interests: {$interests}
- Food Preference: {$foodPref}
- Pace: {$pace}
- Must Include: {$mustInclude}
- Avoid: {$avoid}

IMPORTANT RULES:
- Suggest a realistic Sri Lanka route.
- Mention realistic places on the way.
- Include local experiences, food, tea, viewpoints, shopping when relevant.
- Keep travel practical for Sri Lankan roads and distance.
- Include budget estimates in LKR.
- Include transport guidance in LKR.
- Use actual Sri Lankan place names.
- Return ONLY raw JSON.
- Do not wrap JSON in markdown.
- Do not add explanations before or after JSON.

JSON FORMAT:
{
  \"title\": \"\",
  \"subtitle\": \"\",
  \"summary\": {
    \"start\": \"\",
    \"destination\": \"\",
    \"days\": \"\",
    \"transport\": \"\",
    \"totalEstimatedBudgetLKR\": \"\"
  },
  \"overview\": [],
  \"routeFlow\": [],
  \"pathStops\": [
    {
      \"name\": \"\",
      \"positionOnRoute\": \"\",
      \"reason\": \"\",
      \"highlights\": []
    }
  ],
  \"localExperiences\": [
    {
      \"name\": \"\",
      \"type\": \"\",
      \"description\": \"\",
      \"bestFor\": []
    }
  ],
  \"budgetBreakdown\": [
    {
      \"category\": \"\",
      \"estimate\": \"\",
      \"note\": \"\"
    }
  ],
  \"transportGuidance\": [
    {
      \"mode\": \"\",
      \"detail\": \"\",
      \"priceGuide\": \"\"
    }
  ],
  \"dayPlan\": [
    {
      \"day\": 1,
      \"title\": \"\",
      \"base\": \"\",
      \"plan\": \"\",
      \"keyPlaces\": []
    }
  ],
  \"smartTips\": [],
  \"importantNotes\": []
}";

$geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

$postData = json_encode([
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.7,
        'maxOutputTokens' => 4096,
        'responseMimeType' => 'application/json'
    ]
], JSON_UNESCAPED_UNICODE);

if ($postData === false) {
    sendError('Failed to build AI request.', 500);
}

$ch = curl_init($geminiUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json'
    ],
    CURLOPT_TIMEOUT => 90,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($curlError) {
    sendError('Could not connect to AI service: ' . $curlError, 500);
}

if (!$response) {
    sendError('AI service returned an empty response.', 500);
}

$geminiData = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($geminiData)) {
    sendError('Gemini returned invalid response.', 500);
}

if (isset($geminiData['error'])) {
    $errMsg = $geminiData['error']['message'] ?? ('Gemini API error. HTTP ' . $httpCode);
    sendError('AI error: ' . $errMsg, 500);
}

$text = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? '';

if (!$text) {
    $finishReason = $geminiData['candidates'][0]['finishReason'] ?? '';

    if ($finishReason === 'SAFETY') {
        sendError('AI declined to generate this itinerary due to content policy.', 500);
    }

    sendError('AI returned an empty response. Please try again.', 500);
}

$text = trim($text);
$text = preg_replace('/^```json\s*/i', '', $text);
$text = preg_replace('/^```\s*/i', '', $text);
$text = preg_replace('/\s*```$/', '', $text);
$text = trim($text);

$plan = json_decode($text, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($plan)) {
    if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
        $plan = json_decode($matches[0], true);
    }
}

if (!is_array($plan)) {
    sendError('AI returned invalid itinerary data. Please try again.', 500);
}

sendSuccess([
    'plan' => $plan
]);