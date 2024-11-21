-- !!!!!!!!!!!!!!!
-- EDIT ALL TABLES NAMES FOR PRODUCTION
-- To store user encryption keys, I recommend using a secure vault like AWS KMS, Azure Key Vault or a self-hosted solution instead of the database.
-- !!!!!!!!!!!!!!!

--
-- Database: `seguinleo-notes`
--

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` varchar(63) NOT NULL,
  `title` text NOT NULL,
  `content` longtext,
  `color` varchar(63) NOT NULL DEFAULT 'bg-default',
  `dateNote` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hiddenNote` tinyint NOT NULL DEFAULT '0',
  `pinnedNote` tinyint NOT NULL DEFAULT '0',
  `folder` varchar(63) DEFAULT NULL,
  `category` varchar(63) DEFAULT NULL,
  `link` varchar(63) DEFAULT NULL,
  `user` varchar(63) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(63) NOT NULL,
  `name` varchar(63) NOT NULL,
  `psswd` varchar(255) NOT NULL,
  `oneKey` varchar(255) NOT NULL,
  `lastLogin` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `link` (`link`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
