<?php

/**
 * 
 * THIS IS NOT THE REAL CONFIG FILE, THIS IS JUST AN EXAMPLE FOR SELF-HOSTING WITH DOCKER
 * phpMyAdmin is also included in the docker-compose file, http://localhost:8080
 * 
 */

$host = 'db-seguinleo-notes';
$db = 'seguinleo-notes';
$user = 'user';
$pass = 'password';
$port = '3306';
$charset = 'utf8mb4';
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$dsn = "mysql:host=$host;dbname=$db;charset=$charset;port=$port";

try {
    $PDO = new PDO($dsn, $user, $pass, $options);
} catch (Exception $e) {
    throw new Exception('Connection failed');
    return;
}
