-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: localhost    Database: mudserver
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allitems`
--

DROP TABLE IF EXISTS `allitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allitems` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `singular` varchar(45) DEFAULT NULL,
  `plural` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `containerSingular` varchar(45) DEFAULT NULL,
  `containerPlural` varchar(45) DEFAULT NULL,
  `hideWord` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allitems`
--

LOCK TABLES `allitems` WRITE;
/*!40000 ALTER TABLE `allitems` DISABLE KEYS */;
INSERT INTO `allitems` VALUES (0,'Chest of drawers','drawers','drawers','Search','chest of','chest of',''),(1,'Table','table','tables','Search&Hide','','','under'),(2,'Lamp','lamp','lamps','TurnOn','','',''),(3,'Torch','torch','torches','TurnOn&PickUp','','',''),(4,'Radio','radio','radios','TurnOn&PickUp','','',''),(5,'Tub of garlic','garlic clove','garlic cloves','Eat','tub of','tubs of',''),(6,'Pile of plates','plates','plates','KnockOver','pile of','piles of',''),(7,'Pile of pots','pot','pots','KnockOver','pile of','piles of',''),(8,'Shelf of glass bottles','glass bottle',' of glass bottles','KnockOver','shelf of','shelves of',''),(9,'Vase','vase','vases','KnockOver','','',''),(10,'Chest','chest','chests','Search','','',''),(11,'Box','box','boxes','Search','','',''),(12,'Cupboard','cupboard','cupboards','Search','','',''),(13,'Wardrobe','wardrobe','wardrobes','Search&Hide','','','in'),(14,'Bed','bed','beds','Hide','','','under'),(15,'Tub of onions','onion','onions','Eat','tub of','tubs of',''),(16,'Shelf of food','food','food','Eat','shelf of','shelves of',''),(17,'Cabinet','cabinet','cabinets','Search&Hide','','','in'),(18,'Statue','statue','statues','Hide','','','behind'),(19,'Crate','crate','crates','Search&Hide','','','behind'),(20,'Cart','cart','carts','Hide','','','under'),(21,'Hat stand','hat stand','hat stands','Hide','','','behind'),(22,'Desk','desk','desks','Search&Hide','','','under'),(23,'Bomb','bomb','bombs','PickUp','','','');
/*!40000 ALTER TABLE `allitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `area` (
  `id` int(6) DEFAULT NULL,
  `startRoomId` int(6) DEFAULT NULL,
  `description` char(40) DEFAULT NULL,
  `name` char(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
INSERT INTO `area` VALUES (1,90,'An industrial sector','Hackle Warehouse');
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boundary`
--

DROP TABLE IF EXISTS `boundary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boundary` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `roomId` mediumint(9) DEFAULT NULL,
  `allowsVisibility` tinyint(1) DEFAULT NULL,
  `allowsSmell` tinyint(1) DEFAULT NULL,
  `allowsAccess` tinyint(1) DEFAULT NULL,
  `allowsSound` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=434 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boundary`
--

LOCK TABLES `boundary` WRITE;
/*!40000 ALTER TABLE `boundary` DISABLE KEYS */;
INSERT INTO `boundary` VALUES (1,1,0,0,0,0),(2,1,0,0,1,1),(3,1,1,0,1,1),(4,1,0,0,0,0),(5,2,0,0,0,0),(6,2,0,0,1,1),(7,2,1,0,0,0),(8,2,0,0,1,1),(9,3,0,0,0,0),(10,3,0,0,0,0),(11,3,0,0,0,0),(12,3,0,0,1,1),(13,4,0,0,0,0),(14,4,0,0,1,1),(15,4,1,0,1,1),(16,4,0,0,0,0),(17,5,0,0,0,0),(18,5,0,0,0,0),(19,5,0,0,0,0),(20,5,0,0,1,1),(21,6,0,0,0,0),(22,6,1,0,1,1),(23,6,0,0,1,1),(24,6,0,0,0,0),(25,7,0,0,0,0),(26,7,1,0,1,1),(27,7,0,0,0,0),(28,7,1,0,1,1),(29,8,0,0,0,0),(30,8,1,0,1,1),(31,8,0,0,0,0),(32,8,1,0,1,1),(33,9,0,0,0,0),(34,9,0,0,1,1),(35,9,0,0,1,1),(36,9,1,0,1,1),(37,10,0,0,0,0),(38,10,0,0,0,0),(39,10,1,0,1,1),(40,10,1,0,1,1),(41,11,1,0,1,1),(42,11,1,0,1,1),(43,11,1,0,0,0),(44,11,1,0,0,0),(45,12,1,0,0,0),(46,12,1,0,1,1),(47,12,1,0,0,0),(48,12,1,0,1,1),(49,13,1,0,0,0),(50,13,1,0,1,1),(51,13,1,0,1,1),(52,13,1,0,1,1),(53,14,1,0,1,1),(54,14,1,0,1,1),(55,14,1,0,0,0),(56,14,1,0,1,1),(57,15,1,0,0,0),(58,15,1,0,1,1),(59,15,1,0,0,0),(60,15,1,0,1,1),(61,16,0,0,1,1),(62,16,0,0,0,0),(63,16,1,0,1,1),(64,16,0,0,1,1),(65,17,0,0,0,0),(66,17,1,0,1,1),(67,17,0,0,1,1),(68,17,0,0,0,0),(69,18,0,0,1,1),(70,18,1,0,1,1),(71,18,1,0,1,1),(72,18,1,0,1,1),(73,19,0,0,1,1),(74,19,0,0,0,0),(75,19,1,0,1,1),(76,19,1,0,1,1),(77,20,1,0,1,1),(78,20,0,0,0,0),(79,20,1,0,1,1),(80,20,1,0,1,1),(81,21,0,0,0,0),(82,21,1,0,1,1),(83,21,1,0,1,1),(84,21,0,0,0,0),(85,22,0,0,0,0),(86,22,1,0,1,1),(87,22,1,0,0,0),(88,22,1,0,1,1),(89,23,0,0,1,1),(90,23,1,0,1,1),(91,23,1,0,0,0),(92,23,1,0,1,1),(93,24,0,0,0,0),(94,24,0,0,0,0),(95,24,1,0,1,1),(96,24,1,0,1,1),(97,25,0,0,0,0),(98,25,0,0,0,0),(99,25,0,0,1,1),(100,25,0,0,0,0),(101,26,1,0,1,1),(102,26,1,0,1,1),(103,26,0,0,0,0),(104,26,0,0,0,0),(105,27,0,0,1,1),(106,27,0,0,1,1),(107,27,0,0,0,0),(108,27,1,0,1,1),(109,28,1,0,1,1),(110,28,1,0,1,1),(111,28,0,0,0,0),(112,28,1,0,1,1),(113,29,1,0,1,1),(114,29,0,0,0,0),(115,29,0,0,0,0),(116,29,1,0,1,1),(117,30,1,0,1,1),(118,30,0,0,0,0),(119,30,1,0,1,1),(120,30,1,0,0,0),(121,31,1,0,1,1),(122,31,1,0,0,0),(123,31,1,0,1,1),(124,31,0,0,0,0),(125,32,0,0,0,0),(126,32,0,0,0,0),(127,32,0,0,0,0),(128,32,0,0,0,0),(129,33,0,0,0,0),(130,33,0,0,0,0),(131,33,0,0,0,0),(132,33,0,0,0,0),(133,34,1,0,1,1),(134,34,1,0,1,1),(135,34,1,0,1,1),(136,34,1,0,0,0),(137,35,0,0,1,1),(138,35,0,0,0,0),(139,35,1,0,1,1),(140,35,0,0,1,1),(141,36,0,0,0,0),(142,36,1,0,1,1),(143,36,1,0,1,1),(144,36,0,0,0,0),(145,37,0,0,0,0),(146,37,0,0,0,0),(147,37,0,0,0,0),(148,37,1,0,1,1),(149,38,1,0,0,0),(150,38,1,0,1,1),(151,38,1,0,1,1),(152,38,1,0,0,0),(153,39,1,0,0,0),(154,39,1,0,1,1),(155,39,1,0,1,1),(156,39,1,0,1,1),(157,40,1,0,1,1),(158,40,0,0,0,0),(159,40,1,0,1,1),(160,40,1,0,1,1),(161,41,1,0,1,1),(162,41,1,0,1,1),(163,41,1,0,1,1),(164,41,0,0,0,0),(165,42,1,0,0,0),(166,42,1,0,1,1),(167,42,1,0,1,1),(168,42,1,0,1,1),(169,43,1,0,0,0),(170,43,1,0,1,1),(171,43,1,0,1,1),(172,43,1,0,1,1),(173,44,1,0,1,1),(174,44,0,0,0,0),(175,44,1,0,1,1),(176,44,1,0,1,1),(177,45,1,0,1,1),(178,45,0,0,0,0),(179,45,1,0,1,1),(180,45,0,0,0,0),(181,46,1,0,1,1),(182,46,0,0,0,0),(183,46,1,0,1,1),(184,46,0,0,0,0),(185,47,0,0,0,0),(186,47,0,0,0,0),(187,47,1,0,1,1),(188,47,0,0,0,0),(189,48,1,0,1,1),(190,48,1,0,1,1),(191,48,1,0,1,1),(192,48,1,0,0,0),(193,49,1,0,1,1),(194,49,1,0,1,1),(195,49,1,0,1,1),(196,49,1,0,1,1),(197,50,1,0,1,1),(198,50,0,0,0,0),(199,50,1,0,1,1),(200,50,1,0,1,1),(201,51,1,0,1,1),(202,51,1,0,1,1),(203,51,0,0,1,1),(204,51,0,0,0,0),(205,52,1,0,1,1),(206,52,1,0,1,1),(207,52,1,0,1,1),(208,52,1,0,1,1),(209,53,1,0,1,1),(210,53,1,0,1,1),(211,53,1,0,1,1),(212,53,1,0,1,1),(213,54,1,0,1,1),(214,54,0,0,0,0),(215,54,1,0,1,1),(216,54,1,0,1,1),(217,55,1,0,1,1),(218,55,0,0,0,0),(219,55,0,0,0,0),(220,55,0,0,0,0),(221,56,1,0,1,1),(222,56,0,0,1,1),(223,56,1,0,1,1),(224,56,0,0,0,0),(225,57,1,0,1,1),(226,57,0,0,0,0),(227,57,1,0,1,1),(228,57,0,0,1,1),(229,58,1,0,1,1),(230,58,1,0,1,1),(231,58,1,0,1,1),(232,58,1,0,0,0),(233,59,1,0,1,1),(234,59,1,0,1,1),(235,59,1,0,1,1),(236,59,1,0,1,1),(237,60,1,0,1,1),(238,60,0,0,0,0),(239,60,1,0,1,1),(240,60,1,0,1,1),(241,61,0,0,1,1),(242,61,0,0,0,0),(243,61,0,0,0,0),(244,61,0,0,0,0),(245,62,1,0,1,1),(246,62,1,0,1,1),(247,62,1,0,1,1),(248,62,0,0,0,0),(249,63,1,0,1,1),(250,63,1,0,1,1),(251,63,1,0,0,0),(252,63,1,0,1,1),(253,64,1,0,1,1),(254,64,0,0,0,0),(255,64,0,0,1,1),(256,64,1,0,1,1),(257,65,0,0,0,0),(258,65,1,0,1,1),(259,65,1,0,1,1),(260,65,0,0,0,0),(261,66,1,0,1,1),(262,66,0,0,0,0),(263,66,0,0,0,0),(264,66,1,0,1,1),(265,67,1,0,1,1),(266,67,0,0,1,1),(267,67,0,0,0,0),(268,67,0,0,0,0),(269,68,1,0,1,1),(270,68,1,0,1,1),(271,68,1,0,1,1),(272,68,1,0,1,1),(273,69,0,0,1,1),(274,69,0,0,0,0),(275,69,0,0,1,1),(276,69,0,0,0,0),(277,70,1,0,1,1),(278,70,0,0,0,0),(279,70,1,0,1,1),(280,70,1,0,0,0),(281,71,0,0,0,0),(282,71,0,0,1,1),(283,71,0,0,1,1),(284,71,0,0,0,0),(285,72,0,0,1,1),(286,72,1,0,1,1),(287,72,1,0,1,1),(288,72,0,0,1,1),(289,73,1,0,0,0),(290,73,0,0,0,0),(291,73,1,0,1,1),(292,73,1,0,1,1),(293,74,0,0,1,1),(294,74,1,0,1,1),(295,74,1,0,1,1),(296,74,0,0,0,0),(297,75,1,0,1,1),(298,75,0,0,0,0),(299,75,0,0,1,1),(300,75,1,0,1,1),(301,76,0,0,0,0),(302,76,0,0,1,1),(303,76,0,0,1,1),(304,76,0,0,0,0),(305,77,0,0,0,0),(306,77,0,0,1,1),(307,77,0,0,0,0),(308,77,0,0,1,1),(309,78,1,0,1,1),(310,78,1,0,1,1),(311,78,1,0,1,1),(312,78,1,0,1,1),(313,79,0,0,1,1),(314,79,0,0,0,0),(315,79,0,0,0,0),(316,79,0,0,1,1),(317,80,0,0,1,1),(318,80,0,0,0,0),(319,80,0,0,1,1),(320,80,0,0,0,0),(321,81,1,0,1,1),(322,81,1,0,0,0),(323,81,1,0,1,1),(324,81,1,0,0,0),(325,82,1,0,1,1),(326,82,1,0,1,1),(327,82,0,0,0,0),(328,82,1,0,0,0),(329,83,1,0,1,1),(330,83,0,0,1,1),(331,83,0,0,1,1),(332,83,1,0,1,1),(333,84,1,0,1,1),(334,84,0,0,0,0),(335,84,1,0,1,1),(336,84,0,0,0,0),(337,85,0,0,1,1),(338,85,0,0,0,0),(339,85,0,0,0,0),(340,85,0,0,0,0),(341,86,0,0,1,1),(342,86,0,0,1,1),(343,86,0,0,0,0),(344,86,0,0,0,0),(345,87,0,0,0,0),(346,87,0,0,1,1),(347,87,0,0,1,1),(348,87,0,0,1,1),(349,88,1,0,1,1),(350,88,1,0,1,1),(351,88,1,0,0,0),(352,88,1,0,1,1),(353,89,0,0,1,1),(354,89,0,0,0,0),(355,89,0,0,0,0),(356,89,0,0,0,0),(357,90,1,0,1,1),(358,90,0,0,0,0),(359,90,1,0,1,1),(360,90,1,0,0,0),(361,91,1,0,1,1),(362,91,1,0,1,1),(363,91,0,0,0,0),(364,91,1,0,1,1),(365,92,1,0,0,0),(366,92,1,0,1,1),(367,92,0,0,0,0),(368,92,1,0,1,1),(369,93,1,0,1,1),(370,93,1,0,1,1),(371,93,0,0,0,0),(372,93,1,0,1,1),(373,94,1,0,1,1),(374,94,1,0,1,1),(375,94,0,0,0,0),(376,94,1,0,1,1),(377,95,1,0,0,0),(378,95,1,0,1,1),(379,95,0,0,0,0),(380,95,1,0,1,1),(381,96,1,0,0,0),(382,96,1,0,1,1),(383,96,0,0,0,0),(384,96,1,0,1,1),(385,97,1,0,1,1),(386,97,1,0,1,1),(387,97,0,0,0,0),(388,97,1,0,1,1),(389,98,1,0,0,0),(390,98,1,0,1,1),(391,98,0,0,0,0),(392,98,1,0,1,1),(393,99,1,0,0,0),(394,99,1,0,1,1),(395,99,0,0,0,0),(396,99,1,0,1,1),(397,100,1,0,1,1),(398,100,0,0,0,0),(399,100,0,0,0,0),(400,100,1,0,1,1),(433,0,0,0,0,0);
/*!40000 ALTER TABLE `boundary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game` (
  `startRoomId` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1);
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventory` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `itemId1` mediumint(9) DEFAULT NULL,
  `itemId2` mediumint(9) DEFAULT NULL,
  `itemId3` mediumint(9) DEFAULT NULL,
  `characterId` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (11,NULL,NULL,NULL,26),(12,1000,1000,NULL,27),(13,NULL,NULL,NULL,28),(14,NULL,NULL,NULL,29),(15,NULL,NULL,NULL,30),(16,NULL,NULL,NULL,31),(17,NULL,NULL,NULL,32),(18,NULL,NULL,NULL,27);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` mediumint(9) NOT NULL,
  `flavourText` varchar(45) DEFAULT NULL,
  `allitemsId` mediumint(9) DEFAULT NULL,
  `roomId` mediumint(9) DEFAULT NULL,
  `pickUpStatus` varchar(10) DEFAULT NULL,
  `turnOnStatus` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (0,'',1,1,'',''),(1,'',1,1,'',''),(2,'',1,1,'',''),(3,'',16,1,'',''),(4,'',16,1,'',''),(5,'',16,1,'',''),(6,'',16,1,'',''),(7,'',4,1,'',''),(8,'',1,2,'',''),(9,'',1,2,'',''),(10,'',8,2,'',''),(11,'',16,2,'',''),(12,'',16,2,'',''),(13,'',16,2,'',''),(14,'',11,3,'',''),(15,'',11,3,'',''),(16,'',11,3,'',''),(17,'',10,3,'',''),(18,'',17,3,'',''),(19,'',1,4,'',''),(20,'',1,4,'',''),(21,'',6,4,'',''),(22,'',5,4,'',''),(23,'',5,4,'',''),(24,'',14,5,'',''),(25,'',17,5,'',''),(26,'',11,5,'',''),(27,'',11,5,'',''),(28,'',12,5,'',''),(29,'marble',18,6,'',''),(30,'mahogany',17,7,'',''),(31,'large',9,9,'',''),(32,'',19,10,'',''),(33,'battered',19,10,'',''),(34,'abandoned',20,14,'',''),(35,'elegant',21,16,'',''),(36,'',12,17,'',''),(37,'',2,17,'',''),(38,'state of the art',4,17,'',''),(39,'boardroom',1,18,'',''),(40,'',10,18,'',''),(41,'',17,19,'',''),(42,'mahogany',13,19,'',''),(43,'',19,21,'',''),(44,'',19,21,'',''),(45,'',11,22,'',''),(46,'',17,23,'',''),(47,'',17,24,'',''),(48,'',8,25,'',''),(49,'',17,25,'',''),(50,'',17,25,'',''),(51,'',11,25,'',''),(52,'',11,25,'',''),(53,'',11,25,'',''),(54,'',9,26,'',''),(55,'',12,27,'',''),(56,'',27,28,'',''),(57,'boardroom',1,29,'',''),(58,'',7,31,'',''),(59,'',1,31,'',''),(60,'small work',20,34,'',''),(61,'',11,35,'',''),(62,'',11,35,'',''),(63,'',11,35,'',''),(64,'',15,35,'',''),(65,'hand',3,35,'dropped',''),(66,'spindley',1,35,'',''),(67,'',19,36,'',''),(68,'',19,36,'',''),(69,'old',9,36,'',''),(70,'cardboard',11,36,'',''),(71,'',10,37,'',''),(72,'old',11,37,'',''),(73,'manky',11,37,'',''),(74,'filthy',11,37,'',''),(75,'',15,37,'',''),(76,'abandoned',14,37,'',''),(77,'',11,41,'',''),(78,'',11,41,'',''),(79,'',8,41,'',''),(80,'',17,43,'',''),(81,'metal',1,43,'',''),(82,'',11,45,'',''),(83,'',11,45,'',''),(84,'',11,45,'',''),(85,'',11,45,'',''),(86,'old',4,45,'',''),(87,'',7,45,'',''),(88,'',17,45,'',''),(89,'',17,45,'',''),(90,'',17,45,'',''),(91,'broken',19,46,'',''),(92,'',5,47,'',''),(93,'',5,47,'',''),(94,'',1,47,'',''),(95,'',7,47,'',''),(96,'broken',19,50,'',''),(97,'work',20,51,'',''),(98,'',8,53,'',''),(99,'',2,53,'',''),(100,'',11,55,'',''),(101,'',11,55,'',''),(102,'',11,55,'',''),(103,'',10,55,'',''),(104,'',17,55,'',''),(105,'',17,55,'',''),(106,'',3,55,'',''),(107,'',8,55,'',''),(108,'',8,55,'',''),(109,'broken',1,56,'',''),(110,'old horse',20,57,'',''),(111,'',19,57,'',''),(112,'',11,57,'',''),(113,'',5,57,'',''),(114,'',15,57,'',''),(115,'',19,61,'',''),(116,'',19,61,'',''),(117,'',19,61,'',''),(118,'',11,61,'',''),(119,'',10,61,'',''),(120,'',8,61,'',''),(121,'',7,61,'',''),(122,'',17,62,'',''),(123,'',21,63,'',''),(124,'old',13,66,'',''),(125,'',19,67,'',''),(126,'',19,67,'',''),(127,'',12,69,'',''),(128,'',17,69,'',''),(129,'',1,69,'',''),(130,'',3,69,'',''),(131,'',22,71,'',''),(132,'',12,71,'',''),(133,'',1,72,'',''),(134,'',17,72,'',''),(135,'',11,72,'',''),(136,'',11,73,'',''),(137,'',11,73,'',''),(138,'',11,73,'',''),(139,'',11,73,'',''),(140,'',4,73,'',''),(141,'battered',19,74,'',''),(142,'',22,76,'',''),(143,'',21,76,'',''),(144,'',10,76,'',''),(145,'',6,77,'',''),(146,'',6,77,'',''),(147,'',6,77,'',''),(148,'',7,77,'',''),(149,'',7,77,'',''),(150,'',8,77,'',''),(151,'',8,77,'',''),(152,'',8,77,'',''),(153,'kitchen',1,77,'',''),(154,'',16,77,'',''),(155,'',5,77,'',''),(156,'',15,77,'',''),(157,'',19,79,'',''),(158,'',19,79,'',''),(159,'',10,79,'',''),(160,'',11,79,'',''),(161,'',11,79,'',''),(162,'',1,80,'',''),(163,'',14,80,'',''),(164,'',14,80,'',''),(165,'',14,80,'',''),(166,'',14,80,'',''),(167,'',14,80,'',''),(168,'',14,80,'',''),(169,'',4,80,'',''),(170,'',11,80,'',''),(171,'',11,80,'',''),(172,'',11,80,'',''),(173,'',11,80,'',''),(174,'',13,80,'',''),(175,'',12,80,'',''),(176,'',11,82,'',''),(177,'',11,82,'',''),(178,'',22,82,'',''),(179,'',22,83,'',''),(180,'',11,83,'',''),(181,'',11,83,'',''),(182,'',8,85,'',''),(183,'',8,85,'',''),(184,'',8,85,'',''),(185,'',8,85,'',''),(186,'',7,85,'',''),(187,'',11,85,'',''),(188,'',11,85,'',''),(189,'old',13,85,'',''),(190,'',14,86,'',''),(191,'',12,86,'',''),(192,'',0,86,'',''),(193,'',13,86,'',''),(194,'',10,86,'',''),(195,'',2,86,'',''),(196,'',4,87,'',''),(197,'',17,87,'',''),(198,'',1,87,'',''),(199,'',19,89,'',''),(200,'',19,89,'',''),(201,'',15,89,'',''),(202,'',11,89,'',''),(203,'',11,89,'',''),(204,'',11,89,'',''),(205,'',10,89,'',''),(206,'',19,92,'',''),(207,'',19,95,'',''),(208,'abandoned',20,97,'',''),(209,'',23,25,'dropped','');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lights`
--

DROP TABLE IF EXISTS `lights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lights` (
  `id` mediumint(9) NOT NULL,
  `circuit` mediumint(9) DEFAULT NULL,
  `roomId` mediumint(9) DEFAULT NULL,
  `status` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lights`
--

LOCK TABLES `lights` WRITE;
/*!40000 ALTER TABLE `lights` DISABLE KEYS */;
INSERT INTO `lights` VALUES (1,1,1,'ON'),(2,2,3,'ON'),(3,3,4,'ON'),(4,4,5,'ON'),(5,5,6,'ON'),(6,6,16,'ON'),(7,7,17,'ON'),(8,8,21,'ON'),(9,9,25,'ON'),(10,10,35,'ON'),(11,11,45,'ON'),(12,12,47,'ON'),(13,13,55,'ON'),(14,14,61,'ON'),(15,15,69,'ON'),(16,16,71,'ON'),(17,17,76,'ON'),(18,18,77,'ON'),(19,19,87,'ON'),(20,20,80,'ON');
/*!40000 ALTER TABLE `lights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` char(40) DEFAULT NULL,
  `description` char(255) DEFAULT NULL,
  `areaId` mediumint(9) DEFAULT NULL,
  `position` int(9) DEFAULT NULL,
  `northBoundary` mediumint(9) DEFAULT NULL,
  `eastBoundary` mediumint(9) DEFAULT NULL,
  `southBoundary` mediumint(9) DEFAULT NULL,
  `westBoundary` mediumint(9) DEFAULT NULL,
  `circuit` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'John\'s Biscuits','John\'s biscuit shop.',1,1,1,2,3,4,1),(2,'John\'s Biscuits','John\'s biscuit shop.',1,2,5,6,7,8,1),(3,'John\'s Biscuits','The backroom.',1,3,9,10,11,12,2),(4,'Bill\'s Burgers','Bills\'s Burger Shop.',1,4,13,14,15,16,3),(5,'Bill\'s Burgers','The backroom.',1,5,17,18,19,20,4),(6,'Hackle House','The gallery.',1,6,21,22,23,24,5),(7,'Hackle House','The gallery.',1,7,25,26,27,28,5),(8,'Hackle House','The gallery.',1,8,29,30,31,32,5),(9,'Hackle House','The gallery.',1,9,33,34,35,36,5),(10,'Outer Wall','Outer wall.',1,10,37,38,39,40,-1),(11,'Grease Row','A street.  Grease Row.',1,11,41,42,43,44,-1),(12,'Grease Row','A street.  Grease Row.',1,12,45,46,47,48,-1),(13,'Grease Row','A street.  Grease Row.',1,13,49,50,51,52,-1),(14,'Grease Row','A street.  Grease Row.',1,14,53,54,55,56,-1),(15,'Grease Row','A street.  Grease Row.',1,15,57,58,59,60,-1),(16,'Hackle House','The cloakroom.',1,16,61,62,63,64,6),(17,'Hackle House','The boardroom.',1,17,65,66,67,68,7),(18,'Hackle House','The boardroom.',1,18,69,70,71,72,7),(19,'Hackle House','The boardroom.',1,19,73,74,75,76,7),(20,'Outer Wall','Outer wall.',1,20,77,78,79,80,-1),(21,'Warehouse','Main floor.',1,21,81,82,83,84,8),(22,'Warehouse','Main floor.',1,22,85,86,87,88,8),(23,'Warehouse','Main floor.',1,23,89,90,91,92,8),(24,'Warehouse','Main floor.',1,24,93,94,95,96,8),(25,'Warehouse','A storeroom.',1,25,97,98,99,100,9),(26,'Hackle House','The cloakroom.',1,26,101,102,103,104,6),(27,'Hackle House','The cloakroom.',1,27,105,106,107,108,6),(28,'Hackle House','The boardroom.',1,28,109,110,111,112,7),(29,'Hackle House','The boardroom.',1,29,113,114,115,116,7),(30,'Outer Wall','Outer wall.',1,30,117,118,119,120,-1),(31,'Warehouse','Main floor.',1,31,121,122,123,124,8),(32,'Warehouse','Main floor.',1,32,125,126,127,128,8),(33,'Warehouse','Main floor.',1,33,129,130,131,132,8),(34,'Warehouse','Main floor.',1,34,133,134,135,136,8),(35,'Warehouse','a storeroom.',1,35,137,138,139,140,10),(36,'Stabbers Alley','Alleyway.',1,36,141,142,143,144,-1),(37,'Stabbers Alley','Alleyway end.',1,37,145,146,147,148,-1),(38,'Barn','Yard.',1,38,149,150,151,152,-1),(39,'Barn','Yard.',1,39,153,154,155,156,-1),(40,'Outer Wall','Outer wall.',1,40,157,158,159,160,-1),(41,'Warehouse','Main floor.',1,41,161,162,163,164,8),(42,'Warehouse','Main floor.',1,42,165,166,167,168,8),(43,'Warehouse','Main floor.',1,43,169,170,171,172,8),(44,'Warehouse','Main floor.',1,44,173,174,175,176,8),(45,'Warehouse','A storeroom.',1,45,177,178,179,180,11),(46,'Stabbers Alley','Alleyway.',1,46,181,182,183,184,-1),(47,'Barn','Barn.',1,47,185,186,187,188,12),(48,'Barn','Yard.',1,48,189,190,191,192,-1),(49,'Barn','Yard.',1,49,193,194,195,196,-1),(50,'Outer Wall','Outer wall.',1,50,197,198,199,200,-1),(51,'Warehouse','Main floor.',1,51,201,202,203,204,8),(52,'Warehouse','Main floor.',1,52,205,206,207,208,8),(53,'Warehouse','Main floor.',1,53,209,210,211,212,8),(54,'Warehouse','Main floor.',1,54,213,214,215,216,8),(55,'Warehouse','A storeroom.',1,55,217,218,219,220,13),(56,'Stabbers Alley','Alleyway.',1,56,221,222,223,224,-1),(57,'Barn','Barn.',1,57,225,226,227,228,12),(58,'Barn','Yard.',1,58,229,230,231,232,-1),(59,'Barn','Yard.',1,59,233,234,235,236,-1),(60,'Outer Wall','Outer wall.',1,60,237,238,239,240,-1),(61,'Warehouse','A storeroom.',1,61,241,242,243,244,14),(62,'Warehouse','Main floor.',1,62,245,246,247,248,8),(63,'Warehouse','Main floor.',1,63,249,250,251,252,8),(64,'Warehouse','Main floor.',1,64,253,254,255,256,8),(65,'Stabbers Alley','Alleyway.',1,65,257,258,259,260,-1),(66,'Stabbers Alley','Alleyway.',1,66,261,262,263,264,-1),(67,'Barn','Barn.',1,67,265,266,267,268,12),(68,'Barn','Yard.',1,68,269,270,271,272,-1),(69,'Barn','Out house.',1,69,273,274,275,276,15),(70,'Outer Wall','Outer wall.',1,70,277,278,279,280,-1),(71,'Warehouse','Office.',1,71,281,282,283,284,16),(72,'Warehouse','Office.',1,72,285,286,287,288,16),(73,'Warehouse','Office.',1,73,289,290,291,292,16),(74,'Stabbers Alley','Alleyway.',1,74,293,294,295,296,-1),(75,'Stabbers Alley','Alleyway.',1,75,297,298,299,300,-1),(76,'Ral House','Study.',1,76,301,302,303,304,17),(77,'Ral House','Kitchen.',1,77,305,306,307,308,18),(78,'Barn','Yard.',1,78,309,310,311,312,-1),(79,'Barn','Out house.',1,79,313,314,315,316,15),(80,'Outer Wall','Guardhouse.',1,80,317,318,319,320,20),(81,'Warehouse','Front Yard.',1,81,321,322,323,324,-1),(82,'Warehouse','Office.',1,82,325,326,327,328,16),(83,'Warehouse','Office.',1,83,329,330,331,332,16),(84,'Stabbers Alley','Alleyway.',1,84,333,334,335,336,-1),(85,'Shack','Abandoned shack.',1,85,337,338,339,340,-1),(86,'Ral House','Bedroom.',1,86,341,342,343,344,18),(87,'Ral House','Front room.',1,87,345,346,347,348,19),(88,'Garden','Garden.',1,88,349,350,351,352,-1),(89,'Barn','Out house.',1,89,353,354,355,356,15),(90,'Outer Wall','Outer wall.',1,90,357,358,359,360,-1),(91,'Outer Wall','Outer wall.',1,91,361,362,363,364,-1),(92,'Outer Wall','Outer wall.',1,92,365,366,367,368,-1),(93,'Outer Wall','Outer wall.',1,93,369,370,371,372,-1),(94,'Outer Wall','Outer wall.',1,94,373,374,375,376,-1),(95,'Outer Wall','Outer wall.',1,95,377,378,379,380,-1),(96,'Outer Wall','Outer wall.',1,96,381,382,383,384,-1),(97,'Outer Wall','Outer wall.',1,97,385,386,387,388,-1),(98,'Outer Wall','Outer wall.',1,98,389,390,391,392,-1),(99,'Outer Wall','Outer wall.',1,99,393,394,395,396,-1),(100,'Outer Wall','Outer wall.',1,100,397,398,399,400,-1),(131,'name','description',0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `characterName` char(40) DEFAULT NULL,
  `characterId` mediumint(9) NOT NULL AUTO_INCREMENT,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  `roomId` mediumint(9) DEFAULT NULL,
  `lookDirection` varchar(15) DEFAULT NULL,
  `health` int(11) DEFAULT NULL,
  `bullets` int(11) DEFAULT NULL,
  `gunPower` int(11) DEFAULT NULL,
  `aim` int(11) DEFAULT NULL,
  `inventoryId` mediumint(9) DEFAULT NULL,
  `maxhealth` int(11) DEFAULT NULL,
  `smell` int(11) DEFAULT NULL,
  `clumsiness` int(11) DEFAULT NULL,
  PRIMARY KEY (`characterId`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Brian',26,'','password111',21,'south',8,8,2,2,11,10,0,0),('John',27,'','password111',23,'south',8,8,2,2,12,10,0,0),('Phil',28,'','password111',1,'north',10,8,2,2,13,10,0,NULL),('Kim',29,'','password111',1,'north',10,8,2,2,14,10,0,NULL),('Kong',30,'','password111',1,'north',10,8,2,2,15,10,0,NULL),('Leo',31,'','rum',NULL,'north',10,8,2,2,16,10,0,0),('frank',32,'','green',1,'north',10,8,2,2,17,10,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-14 13:33:49
