<?php

/**
 * !!!!!!!!!!!!!!!
 * EDIT HOST, DATABASE, USER AND PASSWORD FOR PRODUCTION
 * !!!!!!!!!!!!!!!
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
