<?php
$nameCreate = filter_input(INPUT_POST, 'nameCreate', FILTER_DEFAULT);
$psswdCreate = filter_input(INPUT_POST, 'psswdCreate', FILTER_DEFAULT);

if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $nameCreate) === false) {
    throw new Exception('Account creation failed');
    return;
}
if (strlen($nameCreate) < 3 || strlen($nameCreate) > 30 || strlen($psswdCreate) < 10 || strlen($psswdCreate) > 64) {
    throw new Exception('Account creation failed');
    return;
}

session_name('secureNotes');
session_start();

if (isset($_SESSION['name']) === true) {
    throw new Exception('Account creation failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$id = bin2hex(random_bytes(12));
$psswdCreateHash = password_hash($psswdCreate, PASSWORD_DEFAULT);

/**
 * 
 * Store key in sql database or, use a secure vault like AWS KMS, Azure Key Vault or a self-hosted solution.
 *
 */
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
