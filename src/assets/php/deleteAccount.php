<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];
$psswd = filter_input(INPUT_POST, 'psswd', FILTER_DEFAULT);

if (filter_input(INPUT_POST, 'csrf_token', FILTER_DEFAULT) !== $_SESSION['csrf_token']) {
    throw new Exception('Connection timeout, please reload the page');
    return;
}
if (isset($name, $userId) === false) {
    throw new Exception('Account deletion failed');
    return;
}
if (strlen($psswd) < 10 || strlen($psswd) > 64) {
    throw new Exception('Account deletion failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

try {
    $query = $PDO->prepare("SELECT psswd FROM users WHERE name=:CurrentUser AND id=:UserId LIMIT 1");
    $query->execute(
        [
            ':CurrentUser' => $name,
            ':UserId'      => $userId
        ]
    );
    $row = $query->fetch();
    if (!$row) {
        throw new Exception('Account deletion failed');
        return;
    }
} catch (Exception $e) {
    throw new Exception('Account deletion failed');
    return;
}

if (!password_verify($psswd, $row['psswd'])) {
    throw new Exception('Account deletion failed');
    return;
}

$query->closeCursor();

try {
    $query = $PDO->prepare("DELETE FROM users WHERE name=:CurrentUser AND id=:UserId");
    $query->execute(
        [
            ':CurrentUser' => $name,
            ':UserId'      => $userId
        ]
    );
} catch (Exception $e) {
    throw new Exception('Account deletion failed');
    return;
}

$query->closeCursor();
$PDO = null;
session_unset();
session_destroy();
header('Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"');
