-- !!!!!!!!!!!!!!!
-- EDIT ALL TABLES NAMES FOR PRODUCTION
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
  `color` varchar(63) NOT NULL,
  `dateNote` datetime NOT NULL,
  `hiddenNote` tinyint NOT NULL DEFAULT '0',
  `pinnedNote` tinyint NOT NULL DEFAULT '0',
  `category` tinyint NOT NULL DEFAULT '0',
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
  `oneKey` varchar(255) NOT NULL
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
