<?php
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'])) {
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$nom = $_SESSION["nom"];
$userId = $_SESSION["userId"];
$query = $PDO->prepare("DELETE FROM users WHERE nom=:CurrentUser AND id=:UserId");
$query->execute(
    [
        ':CurrentUser'  => $nom,
        ':UserId'       => $userId
    ]
);
session_unset();
session_destroy();
$query->closeCursor();
$PDO = null;
