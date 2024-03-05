<?php
if (isset($_POST['nameCreate'], $_POST['psswdCreate']) === false) {
    throw new Exception('Account creation failed');
    return;
}

session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name']) === true) {
    throw new Exception('Account creation failed');
    return;
}
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Account creation failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$nameCreate = $_POST['nameCreate'];
$psswdCreate = $_POST['psswdCreate'];
$psswdCreateHash = password_hash($psswdCreate, PASSWORD_DEFAULT);
$key = bin2hex(random_bytes(32));

try {
    $query = $PDO->prepare("INSERT INTO users (name,psswd,oneKey) VALUES (:NameCreate,:PsswdHash,:OneKey)");
    $query->execute(
        [
            ':NameCreate' => $nameCreate,
            ':PsswdHash'  => $psswdCreateHash,
            ':OneKey'     => $key
        ]
    );
} catch (Exception $e) {
    throw new Exception('Account creation failed');
    return;
}

$query->closeCursor();
$PDO = null;
