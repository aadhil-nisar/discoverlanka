# DiscoverLanka v2 — Setup & Developer Guide

A complete Sri Lanka travel website with user authentication, email verification, trip planning, reviews, and a full user profile system.

---

## Quick Start (XAMPP / WAMP)

### 1. Place files
Copy the `discoverlanka_complete/` folder into your server root:
- **XAMPP (Windows):** `C:/xampp/htdocs/discoverlanka/`
- **WAMP (Windows):**  `C:/wamp64/www/discoverlanka/`
- **Linux/Mac XAMPP:** `/opt/lampp/htdocs/discoverlanka/`

### 2. Create the database
1. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Click **Import** → choose `backend/config/database.sql`
3. Click **Go**

That creates the `discoverlanka` database with all tables and sample data.

### 3. Configure database credentials
Open `backend/config/db.php` and update:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'discoverlanka');
define('DB_USER', 'root');       // your MySQL username
define('DB_PASS', '');           // your MySQL password (blank on XAMPP default)
```

### 4. Configure your email address
Open `backend/config/email.php` and update:
```php
define('ADMIN_EMAIL', 'aadhilnisar1616@gmail.com');   // YOUR email — receives contact form messages
define('SITE_NAME',   'DiscoverLanka');
define('SITE_URL',    'http://localhost/discoverlanka');  // your site URL
```

### 5. Open the site
Visit: `http://localhost/discoverlanka/index.html`
---

## AI Trip Planner Setup (Required for Plan Trip page)

The AI planner uses **Google Gemini** to generate personalised Sri Lanka itineraries.

### Get your free API key
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy your key

### Add it to the project
Open `backend/config/ai.php` and replace the placeholder:
```php
define('GEMINI_API_KEY', 'AIzaXXXXXXXXXXXXXXXXXXXXXXXX');  // ← your real key
```

That is all. The planner will start working immediately.

> **Cost**: Gemini 1.5 Flash has a generous **free tier** (15 requests/min, 1 million tokens/day). No credit card needed to start.



---

## Email Setup (Important!)

The contact form and email verification need PHP `mail()` to work.

### On a live hosting server
`mail()` works out of the box on most Linux hosts. Just set `ADMIN_EMAIL` and `SITE_URL` correctly.

### On XAMPP (local development)
PHP's `mail()` doesn't work by default. You have two options:

**Option A — Use a fake SMTP logger (easiest for testing)**
1. Install [MailHog](https://github.com/mailhog/MailHog) or [Mailtrap](https://mailtrap.io)
2. Edit `C:/xampp/php/php.ini`:
   ```
   [mail function]
   SMTP = localhost
   smtp_port = 1025
   sendmail_from = noreply@discoverlanka.local
   ```

**Option B — Use PHPMailer with Gmail SMTP (recommended for production)**
1. Run in your project root: `composer require phpmailer/phpmailer`
2. Replace the `sendMail()` function in `backend/config/email.php` with:
```php
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';

function sendMail(string $to, string $subject, string $htmlBody): bool {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'your@gmail.com';
        $mail->Password   = 'your-app-password'; // Gmail App Password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;
        $mail->setFrom(ADMIN_EMAIL, SITE_NAME);
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mail error: " . $e->getMessage());
        return false;
    }
}
```

---

## File Structure

```
discoverlanka/
├── index.html              ← Home page
├── signin.html             ← Sign In / Register / Forgot Password (NEW)
├── profile.html            ← User profile with tabs (UPDATED)
├── contact.html            ← Contact form (FIXED — now saves + emails)
├── reviews.html            ← Reviews page
├── itinerary-planner.html  ← AI trip planner
├── plan-trip.html
├── places.html
├── category.html
├── about.html
├── blog.html
├── help.html
├── terms.html
├── privacy.html
│
├── style.css               ← Main site styles
├── auth.css                ← Auth modal styles
├── signin.css              ← Sign In page + nav button styles (NEW)
├── profile.css             ← Profile page styles (NEW)
├── plan-trip.css
├── category.css
│
├── auth.js                 ← Auth system, session, navbar (UPDATED)
├── script.js               ← Main JS (contact, reviews, newsletter)
├── plan-trip.js
├── category.js
│
└── backend/
    ├── config/
    │   ├── db.php          ← Database connection settings
    │   ├── email.php       ← Email config & templates (NEW)
    │   └── database.sql    ← Full schema with all tables (UPDATED)
    ├── middleware/
    │   └── helpers.php     ← Shared helpers, auth guard, CORS
    └── api/
        ├── auth.php        ← Register, verify email, login, forgot/reset password (UPDATED)
        ├── contact.php     ← Save message + send emails (FIXED)
        ├── profile.php     ← Get/update profile, change password
        ├── reviews.php     ← Reviews CRUD, user reviews filter (UPDATED)
        ├── itineraries.php ← Save/list/delete itineraries
        ├── newsletter.php  ← Newsletter subscriptions
        └── ai-plan-trip.php ← AI itinerary generation
```

---

## What's New in v2

### 🔐 Authentication
| Feature | Status |
|---|---|
| Register with name, email, password | ✅ |
| Email verification (6-digit code, 15 min expiry) | ✅ NEW |
| Resend verification code | ✅ NEW |
| Login with email + password | ✅ |
| Forgot password → email reset link | ✅ NEW |
| Reset password via secure token | ✅ NEW |
| Sign Out | ✅ |

### 📄 Dedicated Sign In Page (`signin.html`)
- Replaces modal popups with a full-page, two-panel layout
- Left panel: branding with feature highlights
- Right panel: all auth flows in one place
- "Sign In" button added to every page's navigation bar
- Hides automatically when user is logged in

### 👤 Enhanced Profile (`profile.html`)
- **Overview tab** — account info, bio, quick actions
- **My Itineraries tab** — list all saved itineraries with delete option
- **My Reviews tab** — list all submitted reviews with delete option
- **Settings tab** — edit profile, change password, upload/remove profile photo
- Profile photo upload (stores as base64 in DB — for production, use file storage)
- Member stats (itinerary count, review count, join year)

### 📬 Contact Form (Fixed)
- **Was:** Saved to DB only, no email sent
- **Now:** Saves to DB + sends admin notification email + sends auto-reply to the user

### 🗄️ Database Changes
Two new tables added:
- `email_verifications` — stores 6-digit codes for email confirmation
- `password_resets` — stores secure tokens for password reset links
- `users` — added `email_verified` column
- `contacts` — added `user_id` foreign key and `status` column

---

## API Endpoints Reference

### Auth (`backend/api/auth.php`)
| Method | URL | Description |
|---|---|---|
| POST | `auth.php?action=register` | Create account (sends verification email) |
| POST | `auth.php?action=verify_email` | Verify with 6-digit code |
| POST | `auth.php?action=resend_verification` | Resend verification code |
| POST | `auth.php?action=login` | Login |
| POST | `auth.php?action=logout` | Logout |
| POST | `auth.php?action=forgot_password` | Send password reset email |
| POST | `auth.php?action=reset_password` | Set new password with token |
| GET  | `auth.php?action=me` | Get current user (requires auth) |

### Profile (`backend/api/profile.php`)
| Method | URL | Description |
|---|---|---|
| GET  | `profile.php` | Get profile + counts (requires auth) |
| POST | `profile.php` | Update profile info (requires auth) |
| POST | `profile.php?action=change_password` | Change password (requires auth) |

### Reviews (`backend/api/reviews.php`)
| Method | URL | Description |
|---|---|---|
| GET    | `reviews.php` | All approved reviews |
| GET    | `reviews.php?my=1` | Current user's reviews (requires auth) |
| POST   | `reviews.php` | Submit review |
| DELETE | `reviews.php?id=X` | Delete own review (requires auth) |

### Contact (`backend/api/contact.php`)
| Method | URL | Description |
|---|---|---|
| POST | `contact.php` | Submit message (saves to DB + sends emails) |

---

## Step-by-Step Deployment to Live Hosting

1. **Upload files** via FTP/cPanel File Manager to `public_html/discoverlanka/`
2. **Create MySQL database** in cPanel → MySQL Databases
3. **Import SQL** in phpMyAdmin → Import → `backend/config/database.sql`
4. **Update** `backend/config/db.php` with your hosting DB credentials
5. **Update** `backend/config/email.php` with your real email and site URL
6. **Test** the contact form — you should receive an email within seconds

---

## Troubleshooting

**Contact form saves but I don't get email**
→ Check `ADMIN_EMAIL` in `backend/config/email.php` is your real email.
→ On XAMPP, `mail()` needs SMTP configured. Use PHPMailer + Gmail (see Email Setup above).

**"Database connection failed"**
→ Check DB credentials in `backend/config/db.php`.
→ Make sure the `discoverlanka` database exists in phpMyAdmin.

**Verification code not arriving**
→ Same mail() issue. Check spam folder first.
→ During development, you can temporarily remove email verification by setting `email_verified = 1` directly in the `users` table via phpMyAdmin.

**Profile shows "Please sign in" even after logging in**
→ Clear browser localStorage: F12 → Application → Local Storage → Clear all, then sign in again.

**Avatar photo not saving**
→ Photos are stored as base64 data URLs in the database. This works fine for development. For production with many users, use a file upload system and store images in `/uploads/avatars/`.

**Reset password link doesn't work**
→ Make sure `SITE_URL` in `email.php` matches exactly where your site is hosted (no trailing slash).

---

## Security Notes for Production

- Change `DB_PASS` from blank to a strong password
- Move `backend/config/` above your web root or add `.htaccess` protection
- Use HTTPS (SSL certificate — free via Let's Encrypt)
- Limit avatar upload size and validate file type server-side for production
- Consider rate limiting on auth endpoints to prevent brute force

---

*Built with PHP, MySQL, vanilla HTML/CSS/JS — no framework dependencies.*
