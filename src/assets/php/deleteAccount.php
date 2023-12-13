<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name'], $_SESSION['userId']) === false) {
    http_response_code(403);
    return;
}
if (is_string($_SESSION['name']) === false || is_int($_SESSION['userId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$userId = $_SESSION['userId'];

try {
    $query = $PDO->prepare("DELETE FROM users WHERE name=:CurrentUser AND id=:UserId");
    $query->execute(
        [
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
session_unset();
session_destroy();
