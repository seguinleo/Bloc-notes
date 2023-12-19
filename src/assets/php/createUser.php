<?php
global $PDO;
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name']) === true) {
    http_response_code(403);
    return;
}
if ($_POST['csrf_token_create'] !== $_SESSION['csrf_token_create']) {
    http_response_code(403);
    return;
}
if (isset($_POST['nameCreate'], $_POST['psswdCreate']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nameCreate = $_POST['nameCreate'];
$psswdCreate = $_POST['psswdCreate'];
$psswdCreateHash = password_hash($psswdCreate, PASSWORD_DEFAULT);
$key = openssl_random_pseudo_bytes(32);

try {
    $query = $PDO->prepare("INSERT INTO users (name,psswd,oneKey) VALUES (:nameCreate,:psswdHash,:OneKey)");
    $query->execute(
        [
            ':nameCreate' => $nameCreate,
            ':psswdHash'  => $psswdCreateHash,
            ':OneKey'     => htmlspecialchars($key, ENT_QUOTES, 'UTF-8'),
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
