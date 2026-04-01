-- ============================================================
-- SMARTx Artist Platform — MariaDB Schema
-- Run this in phpMyAdmin on the `smartx` database
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`         CHAR(36)     NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('admin','member') NOT NULL DEFAULT 'member',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ARTIST DETAILS
-- ============================================================
CREATE TABLE IF NOT EXISTS `artist_details` (
  `id`                     CHAR(36) NOT NULL,
  `member_id`              CHAR(36) NOT NULL,
  `perfil_completo`        TINYINT(1) NOT NULL DEFAULT 0,
  `slug`                   VARCHAR(255) DEFAULT NULL,
  `created_at`             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Dados pessoais
  `artistic_name`          TEXT,
  `full_name`              TEXT,
  `profile_image`          TEXT,
  `how_is_it_defined1`     TEXT,
  `how_is_it_defined`      TEXT,
  `cell_phone`             VARCHAR(30),
  `date_of_birth`          DATE,
  `country_of_birth`       VARCHAR(100),
  `profile_text2`          TEXT,
  `address1`               TEXT,
  `postal_code`            VARCHAR(20),
  `address2`               TEXT,
  `city`                   VARCHAR(100),
  `country_residence`      VARCHAR(100),
  `accepted_terms1`        TINYINT(1) DEFAULT 0,
  `accepted_terms2`        TINYINT(1) DEFAULT 0,

  -- Biografia e redes
  `biography1`             LONGTEXT,
  `facebook`               TEXT,
  `instagram`              TEXT,
  `music_spotify_apple`    TEXT,
  `youtube_channel`        TEXT,
  `website`                TEXT,

  -- Mídia
  `audio`                  TEXT,
  `video_banner_landscape` TEXT,
  `video_banner_portrait`  TEXT,
  `link_to_video`          TEXT,
  `link_to_video2`         TEXT,
  `link_to_video3`         TEXT,
  `link_to_video4`         TEXT,
  `link_to_video5`         TEXT,
  `link_to_video6`         TEXT,
  `link_to_video7`         TEXT,
  `link_to_video8`         TEXT,
  `link_to_video9`         TEXT,
  `link_to_video10`        TEXT,

  -- Textos editoriais
  `visao_geral_titulo`     LONGTEXT,
  `historia_titulo`        LONGTEXT,
  `carreira_titulo`        LONGTEXT,
  `mais_titulo`            LONGTEXT,

  -- Fotografias (12 slots)
  `image1`                 TEXT, `image1_text`  TEXT,
  `image2`                 TEXT, `image2_text`  TEXT,
  `image3`                 TEXT, `image3_text`  TEXT,
  `image4`                 TEXT, `image4_text`  TEXT,
  `image5`                 TEXT, `image5_text`  TEXT,
  `image6`                 TEXT, `image6_text`  TEXT,
  `image7`                 TEXT, `image7_text`  TEXT,
  `image8`                 TEXT, `image8_text`  TEXT,
  `image9`                 TEXT, `image9_text`  TEXT,
  `image10`                TEXT, `image10_text` TEXT,
  `image11`                TEXT, `image11_text` TEXT,
  `image12`                TEXT, `image12_text` TEXT,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_artist_member` (`member_id`),
  UNIQUE KEY `uq_artist_slug` (`slug`),
  CONSTRAINT `fk_artist_user` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS `projects` (
  `id`           CHAR(36) NOT NULL,
  `member_id`    CHAR(36) NOT NULL,
  `title`        TEXT,
  `cover_image`  TEXT,
  `banner_image` TEXT,
  `about`        LONGTEXT,
  `block1_title` LONGTEXT, `block1_image` TEXT,
  `block2_title` LONGTEXT, `block2_image` TEXT,
  `block3_title` LONGTEXT, `block3_image` TEXT,
  `block4_title` LONGTEXT, `block4_image` TEXT,
  `block5_title` LONGTEXT, `block5_image` TEXT,
  `team_tech`    LONGTEXT,
  `team_art`     LONGTEXT,
  `project_sheet` LONGTEXT,
  `partners`     LONGTEXT,
  `status`       ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_member` (`member_id`),
  CONSTRAINT `fk_projects_user` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS `events` (
  `id`          CHAR(36)  NOT NULL,
  `member_id`   CHAR(36)  NOT NULL,
  `name`        TEXT,
  `banner`      TEXT,
  `date`        DATE,
  `start_time`  TIME,
  `end_time`    TIME,
  `place`       TEXT,
  `cta_link`    TEXT,
  `description` LONGTEXT,
  `status`      ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_events_member` (`member_id`),
  CONSTRAINT `fk_events_user` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS `documents` (
  `id`         CHAR(36) NOT NULL,
  `member_id`  CHAR(36) NOT NULL,
  `title`      TEXT,
  `file_url`   TEXT,
  `kind`       ENUM('contrato','termo','outro') NOT NULL DEFAULT 'outro',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_documents_member` (`member_id`),
  CONSTRAINT `fk_documents_user` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id`         CHAR(36)     NOT NULL,
  `member_id`  CHAR(36)     NOT NULL,
  `subject`    VARCHAR(500) NOT NULL,
  `message`    LONGTEXT     NOT NULL,
  `status`     ENUM('open','in_progress','closed') NOT NULL DEFAULT 'open',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tickets_member` (`member_id`),
  CONSTRAINT `fk_tickets_user` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
