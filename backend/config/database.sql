-- ============================================================
-- DiscoverLanka Database Schema v2
-- Run this in phpMyAdmin or MySQL CLI
-- ============================================================

CREATE DATABASE IF NOT EXISTS discoverlanka CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE discoverlanka;

-- ── USERS TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  first_name     VARCHAR(60) NOT NULL,
  last_name      VARCHAR(60) NOT NULL,
  email          VARCHAR(180) NOT NULL UNIQUE,
  password       VARCHAR(255) NOT NULL,
  phone          VARCHAR(30) DEFAULT NULL,
  country        VARCHAR(80) DEFAULT NULL,
  bio            TEXT DEFAULT NULL,
  avatar_url     VARCHAR(500) DEFAULT NULL,
  auth_token     VARCHAR(64) DEFAULT NULL,
  email_verified TINYINT(1) DEFAULT 1,
  role           ENUM('user','admin') DEFAULT 'user',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── EMAIL VERIFICATION TOKENS ───────────────────────────────
CREATE TABLE IF NOT EXISTS email_verifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  email      VARCHAR(180) NOT NULL,
  token      VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  used       TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── PASSWORD RESET TOKENS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(180) NOT NULL,
  token      VARCHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used       TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── SAVED ITINERARIES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_itineraries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(220) NOT NULL,
  type        ENUM('ai','manual') DEFAULT 'manual',
  data        LONGTEXT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT DEFAULT NULL,
  name         VARCHAR(120) NOT NULL,
  destination  VARCHAR(220) NOT NULL,
  travel_type  VARCHAR(60) DEFAULT NULL,
  visit_time   VARCHAR(80) DEFAULT NULL,
  title        VARCHAR(220) NOT NULL,
  review_text  TEXT NOT NULL,
  rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  approved     TINYINT(1) DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── CONTACTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT DEFAULT NULL,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(180) NOT NULL,
  phone       VARCHAR(30) DEFAULT NULL,
  subject     VARCHAR(220) NOT NULL,
  reason      VARCHAR(100) DEFAULT NULL,
  message     TEXT NOT NULL,
  status      ENUM('new','read','replied') DEFAULT 'new',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── NEWSLETTER SUBSCRIBERS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(180) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── SAMPLE REVIEWS ──────────────────────────────────────────
INSERT IGNORE INTO reviews (name, destination, travel_type, visit_time, title, review_text, rating) VALUES
('Sarah Johnson', 'Kandy, Ella & Mirissa', 'Couple Trip', 'December 2024',
 'Amazing hill country experience', 'The site made it so much easier to organize my route through Sri Lanka.', 5),
('Michael Chen', 'Sigiriya & Hill Country', 'Solo Traveler', 'November 2024',
 'Discovered hidden gems!', 'DiscoverLanka helped me discover places I would have missed.', 5),
('Emma Williams', 'Galle & South Coast', 'Friends Getaway', 'October 2024',
 'Beautiful design and helpful tools', 'Beautiful design, clear travel inspiration, and helpful planning tools.', 5);
