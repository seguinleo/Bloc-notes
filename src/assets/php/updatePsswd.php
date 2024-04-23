<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];
$psswdOld = filter_input(INPUT_POST, 'psswdOld', FILTER_DEFAULT);
$psswdNew = filter_input(INPUT_POST, 'psswdNew', FILTER_DEFAULT);

if (filter_input(INPUT_POST, 'csrf_token', FILTER_DEFAULT) !== $_SESSION['csrf_token']) {
    throw new Exception('Connection timeout, please reload the page');
    return;
}
if (isset($name, $userId, $psswdOld) === false) {
    throw new Exception('Password update failed');
    return;
}
if (strlen($psswdNew) < 8 || strlen($psswdNew) > 64) {
    throw new Exception('Password update failed');
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
        throw new Exception('Password update failed');
        return;
    }
} catch (Exception $e) {
    throw new Exception('Password update failed');
    return;
}

if (!password_verify($psswdOld, $row['psswd'])) {
    throw new Exception('Password update failed');
    return;
}

$query->closeCursor();
$psswdNewHash = password_hash($psswdNew, PASSWORD_DEFAULT);

try {
    $query = $PDO->prepare("UPDATE users SET psswd=:PsswdHash WHERE name=:CurrentUser AND id=:UserId");
    $query->execute(
        [
            ':PsswdHash'   => $psswdNewHash,
            ':CurrentUser' => $name,
            ':UserId'      => $userId
        ]
    );
} catch (Exception $e) {
    throw new Exception('Password update failed');
    return;
}

$query->closeCursor();
$PDO = null;
