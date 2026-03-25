<?php
// ============================================================
// backend/config/email.php — Email Configuration
// Edit ADMIN_EMAIL and SITE_NAME to match your setup
// For SMTP (recommended), install PHPMailer via Composer:
//   composer require phpmailer/phpmailer
// Or use PHP's built-in mail() function (works on most hosts)
// ============================================================

define('ADMIN_EMAIL', 'aadhilnisar1616@gmail.com');   // <-- Change to your email
define('SITE_NAME',   'DiscoverLanka');
define('SITE_URL',    'http://localhost/DiscoverLanka'); // <-- Change to your URL

/**
 * Send an email using PHP mail()
 * On XAMPP/WAMP you need to configure php.ini SMTP settings.
 * On a live host, mail() usually works out of the box.
 */
function sendMail(string $to, string $subject, string $htmlBody): bool {
    $from    = ADMIN_EMAIL;
    $siteName = SITE_NAME;

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: {$siteName} <{$from}>\r\n";
    $headers .= "Reply-To: {$from}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return mail($to, $subject, $htmlBody, $headers);
}

// ── EMAIL TEMPLATES ─────────────────────────────────────────

function emailTemplate(string $title, string $body): string {
    $siteName = SITE_NAME;
    return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a3c2e,#2d6a4f);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:1px;">Discover<span style="color:#95d5b2;">Lanka</span></h1>
          <p style="margin:6px 0 0;color:#b7e4c7;font-size:13px;">Sri Lanka Travel Guide</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <h2 style="color:#1a3c2e;margin-top:0;">{$title}</h2>
          {$body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #e9ecef;">
          <p style="margin:0;color:#6c757d;font-size:12px;">&copy; 2025 {$siteName}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function emailVerificationTemplate(string $firstName, string $code): string {
    $body = <<<HTML
    <p style="color:#495057;font-size:15px;line-height:1.6;">Hi <strong>{$firstName}</strong>,</p>
    <p style="color:#495057;font-size:15px;line-height:1.6;">Thanks for joining DiscoverLanka! Please verify your email address using the code below:</p>
    <div style="text-align:center;margin:30px 0;">
      <div style="display:inline-block;background:#f0faf5;border:2px dashed #52b788;border-radius:12px;padding:20px 40px;">
        <span style="font-size:42px;font-weight:700;letter-spacing:12px;color:#2d6a4f;">{$code}</span>
      </div>
      <p style="color:#6c757d;font-size:13px;margin-top:12px;">This code expires in 15 minutes</p>
    </div>
    <p style="color:#495057;font-size:15px;line-height:1.6;">If you didn't create an account, you can safely ignore this email.</p>
HTML;
    return emailTemplate('Verify Your Email', $body);
}

function passwordResetTemplate(string $firstName, string $resetUrl): string {
    $body = <<<HTML
    <p style="color:#495057;font-size:15px;line-height:1.6;">Hi <strong>{$firstName}</strong>,</p>
    <p style="color:#495057;font-size:15px;line-height:1.6;">We received a request to reset your DiscoverLanka password. Click the button below to set a new password:</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="{$resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#2d6a4f,#52b788);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:600;">Reset My Password</a>
    </div>
    <p style="color:#6c757d;font-size:13px;">Or copy this link: <a href="{$resetUrl}" style="color:#2d6a4f;">{$resetUrl}</a></p>
    <p style="color:#6c757d;font-size:13px;">This link expires in 1 hour. If you didn't request a password reset, ignore this email — your account is safe.</p>
HTML;
    return emailTemplate('Reset Your Password', $body);
}

function contactNotificationTemplate(string $name, string $email, string $phone, string $subject, string $reason, string $message): string {
    $body = <<<HTML
    <p style="color:#495057;font-size:15px;">You have received a new contact form submission:</p>
    <table width="100%" style="border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:10px;background:#f8f9fa;font-weight:700;width:140px;border:1px solid #dee2e6;">Name</td><td style="padding:10px;border:1px solid #dee2e6;">{$name}</td></tr>
      <tr><td style="padding:10px;background:#f8f9fa;font-weight:700;border:1px solid #dee2e6;">Email</td><td style="padding:10px;border:1px solid #dee2e6;"><a href="mailto:{$email}" style="color:#2d6a4f;">{$email}</a></td></tr>
      <tr><td style="padding:10px;background:#f8f9fa;font-weight:700;border:1px solid #dee2e6;">Phone</td><td style="padding:10px;border:1px solid #dee2e6;">{$phone}</td></tr>
      <tr><td style="padding:10px;background:#f8f9fa;font-weight:700;border:1px solid #dee2e6;">Subject</td><td style="padding:10px;border:1px solid #dee2e6;">{$subject}</td></tr>
      <tr><td style="padding:10px;background:#f8f9fa;font-weight:700;border:1px solid #dee2e6;">Reason</td><td style="padding:10px;border:1px solid #dee2e6;">{$reason}</td></tr>
      <tr><td style="padding:10px;background:#f8f9fa;font-weight:700;border:1px solid #dee2e6;">Message</td><td style="padding:10px;border:1px solid #dee2e6;">{$message}</td></tr>
    </table>
HTML;
    return emailTemplate('New Contact Form Message', $body);
}

function contactAutoReplyTemplate(string $name): string {
    $body = <<<HTML
    <p style="color:#495057;font-size:15px;line-height:1.6;">Hi <strong>{$name}</strong>,</p>
    <p style="color:#495057;font-size:15px;line-height:1.6;">Thank you for reaching out to DiscoverLanka! We have received your message and our team will get back to you within 24–48 hours.</p>
    <p style="color:#495057;font-size:15px;line-height:1.6;">In the meantime, feel free to explore Sri Lanka's beautiful destinations and start planning your dream trip!</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="http://localhost/discoverlanka" style="display:inline-block;background:linear-gradient(135deg,#2d6a4f,#52b788);color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-size:15px;font-weight:600;">Explore DiscoverLanka</a>
    </div>
    <p style="color:#6c757d;font-size:13px;">Warm regards,<br>The DiscoverLanka Team 🌿</p>
HTML;
    return emailTemplate('We Received Your Message!', $body);
}
