<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];

if (filter_input(INPUT_POST, 'csrf_token', FILTER_DEFAULT) !== $_SESSION['csrf_token']) {
    throw new Exception('Connection timeout, please reload the page');
    return;
}
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
    $query = $PDO->prepare("SELECT oneKey FROM users WHERE name=:CurrentUser AND id=:UserId LIMIT 1");
    $query->execute(
        [
            ':CurrentUser' => $name,
            ':UserId'      => $userId
        ]
    );
} catch (Exception $e) {
    throw new Exception('Key retrieval failed');
    return;
}

$key = $query->fetch()['oneKey'];
$query->closeCursor();
