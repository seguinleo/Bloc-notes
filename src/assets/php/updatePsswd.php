<?php
session_name('__Secure-notes');
session_start();

if ($_POST['csrf_token_psswd'] !== $_SESSION['csrf_token_psswd']) {
    http_response_code(403);
    return;
}
if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['psswdNew']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];
$psswdNew = $_POST['psswdNew'];
$psswdNewSecure = password_hash($psswdNew, PASSWORD_DEFAULT);

try {
    $query = $PDO->prepare("UPDATE users SET psswd=:psswdHash WHERE name=:CurrentUser AND id=:UserId");
    $query->execute(
        [
            ':psswdHash'   => $psswdNewSecure,
            ':CurrentUser' => $name,
            ':UserId'      => $userId
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
