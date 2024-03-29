<?php
$nameCreate = $_POST['nameCreate'];
$psswdCreate = $_POST['psswdCreate'];
if (isset($nameCreate, $psswdCreate) === false) {
    throw new Exception('Account creation failed');
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $nameCreate) === false) {
    throw new Exception('Account creation failed');
    return;
}
if (strlen($nameCreate) < 4 || strlen($nameCreate) > 25 || strlen($psswdCreate) < 8 || strlen($psswdCreate) > 64) {
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

$id = bin2hex(random_bytes(12));
$psswdCreateHash = password_hash($psswdCreate, PASSWORD_DEFAULT);
$key = bin2hex(random_bytes(32));

try {
    $query = $PDO->prepare("INSERT INTO users (id,name,psswd,oneKey) VALUES (:Id,:NameCreate,:PsswdHash,:OneKey)");
    $query->execute(
        [
            ':Id'         => $id,
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
