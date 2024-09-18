<?php
date_default_timezone_set("America/Argentina/Buenos_Aires");

$dbdir = explode('/', $_SERVER['SCRIPT_NAME']); 

$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';
$dbname = 'progestion' . (($dbdir[count($dbdir) - 4] == 'test') ? '_test' : '');

$mysqli = new mysqli($dbhost, $dbuser, $dbpass);

if ($mysqli->connect_errno) {
    die("Ha ocurrido un error en la conexión de la base de datos: " . $mysqli->connect_error);
}

$mysqli->query("CREATE DATABASE IF NOT EXISTS `$dbname`");
$mysqli->select_db($dbname);

$mysqli->query("CREATE TABLE IF NOT EXISTS `intervalos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `horaStart` time DEFAULT NULL,
  `horaEnd` time DEFAULT NULL,
  `idAreas` json DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
)");

$mysqli->query("CREATE TABLE IF NOT EXISTS `datos` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `level` float DEFAULT NULL,
  `interval` int DEFAULT NULL,
  `value` text,
  `breed` tinyint(1) DEFAULT NULL,
  `area` tinyint(1) DEFAULT NULL,
  `tipo` int DEFAULT NULL,
  `observaciones` text,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
)");

?>
