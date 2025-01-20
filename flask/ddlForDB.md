CREATE TABLE `likelihood` (
  `id` int NOT NULL AUTO_INCREMENT,
  `likelihoodOfLosing` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11915 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `training_data` (
  `matchID` int NOT NULL AUTO_INCREMENT,
  `ending_stocks_me` int NOT NULL,
  `ending_stocks_opp` int NOT NULL,
  `ending_damage_me` int DEFAULT NULL,
  `ending_damage_opp` int DEFAULT NULL,
  `stage` varchar(45) NOT NULL,
  `character_me` varchar(75) NOT NULL,
  `character_opp` varchar(75) NOT NULL,
  `fileName` varchar(500) NOT NULL,
  `winner` varchar(45) NOT NULL,
  PRIMARY KEY (`matchID`),
  UNIQUE KEY `matchID_UNIQUE` (`matchID`)
) ENGINE=InnoDB AUTO_INCREMENT=374 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
