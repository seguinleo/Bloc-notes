<?php

// THIS IS NOT THE REAL CONFIG FILE, THIS IS JUST AN EXAMPLE FOR SELF-HOSTING

$host = 'localhost';
$db = 'seguinleo-notes';
$user = 'root';
$pass = '';
$port = "3306";
$charset = 'utf8mb4';
$options = [
    \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::ATTR_EMULATE_PREPARES   => false,
];
$dsn = "mysql:host=$host;dbname=$db;charset=$charset;port=$port";
try {
    $PDO = new \PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
