<?php
session_name('__Secure-notes');
session_start();

if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Account deletion failed');
    return;
}
if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['psswd']) === false) {
    throw new Exception('Account deletion failed');
    return;
}
if (is_string($_SESSION['name']) === false || is_int($_SESSION['userId']) === false) {
    throw new Exception('Account deletion failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];
$psswd = $_POST['psswd'];

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
