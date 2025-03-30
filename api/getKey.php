<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];

if (isset($name, $userId) === false) {
    throw new Exception('Key retrieval failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

if ($PDO === null) {
    throw new Exception('Key retrieval failed');
    return;
}

try {
    $query = $PDO->prepare("SELECT oneKey,lastLogin FROM users WHERE name=:CurrentUser AND id=:UserId LIMIT 1");
    $query->execute(
        [
            ':CurrentUser' => $name,
            ':UserId'      => $userId
        ]
    );
    $row = $query->fetch();
} catch (Exception $e) {
    throw new Exception('Key retrieval failed');
    return;
}

$lastLogin = $row['lastLogin'];
$key = $row['oneKey'];
$query->closeCursor();
