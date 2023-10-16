<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_SESSION['userId']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[0-9]+$/', $_SESSION['userId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION['nom'];
$userId = $_SESSION['userId'];

try {
    $query = $PDO->prepare("DELETE FROM users WHERE nom=:CurrentUser AND id=:UserId");
    $query->execute(
        [
            ':CurrentUser' => $nom,
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
