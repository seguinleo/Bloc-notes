<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION["nom"], $_SESSION['userId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION["nom"];
$userId = $_SESSION["userId"];
$query = $PDO->prepare("DELETE FROM users WHERE nom=:CurrentUser AND id=:UserId");
$query->execute(
    [
        ':CurrentUser' => $nom,
        ':UserId'      => $userId
    ]
);
session_unset();
session_destroy();
$query->closeCursor();
$PDO = null;
