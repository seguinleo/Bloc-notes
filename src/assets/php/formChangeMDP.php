<?php
session_name('__Secure-notes');
session_start();
if (isset($_SESSION["nom"], $_SESSION["userId"], $_POST['mdpNew']) === false) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$nom = $_SESSION["nom"];
$userId = $_SESSION["userId"];
$mdpNew = $_POST['mdpNew'];
$mdpNewSecure = password_hash($mdpNew, PASSWORD_DEFAULT);
$query = $PDO->prepare("UPDATE users SET mdp=:MdpHash WHERE nom=:CurrentUser AND id=:UserId");
$query->execute(
    [
        ':MdpHash'      => $mdpNewSecure,
        ':CurrentUser'  => $nom,
        ':UserId'       => $userId
    ]
);
$query->closeCursor();
$PDO = null;
