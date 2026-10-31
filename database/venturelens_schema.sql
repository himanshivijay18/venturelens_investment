-- =======================================================
-- VentureLens Database Schema
-- Database: venturelens_db
-- =======================================================

CREATE DATABASE IF NOT EXISTS `venturelens_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `venturelens_db`;

-- 1. Table: startups
CREATE TABLE IF NOT EXISTS `startups` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `founder_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `funding_stage` VARCHAR(100) DEFAULT 'Seed',
    `target_money` DOUBLE DEFAULT 0.0,
    `yearly_revenue` DOUBLE DEFAULT 0.0,
    `monthly_expenses` DOUBLE DEFAULT 0.0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_startup_category` (`category`),
    INDEX `idx_startup_funding_stage` (`funding_stage`),
    INDEX `idx_startup_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: investors
CREATE TABLE IF NOT EXISTS `investors` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `investor_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `firm_name` VARCHAR(255) NOT NULL,
    `interested_category` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_investor_category` (`interested_category`),
    INDEX `idx_investor_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: saved_startups
CREATE TABLE IF NOT EXISTS `saved_startups` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `investor_id` BIGINT NOT NULL,
    `startup_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_investor_startup` (`investor_id`, `startup_id`),
    CONSTRAINT `fk_saved_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_startup` FOREIGN KEY (`startup_id`) REFERENCES `startups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: meeting_requests
CREATE TABLE IF NOT EXISTS `meeting_requests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `investor_id` BIGINT NOT NULL,
    `startup_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_meeting_status` (`status`),
    CONSTRAINT `fk_meeting_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_meeting_startup` FOREIGN KEY (`startup_id`) REFERENCES `startups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: pitch_decks
CREATE TABLE IF NOT EXISTS `pitch_decks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `startup_id` BIGINT NOT NULL UNIQUE,
    `original_file_name` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(100) NOT NULL,
    `file_size` BIGINT NOT NULL,
    `storage_path` VARCHAR(500) NOT NULL,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pitch_startup` FOREIGN KEY (`startup_id`) REFERENCES `startups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: admins
CREATE TABLE IF NOT EXISTS `admins` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
