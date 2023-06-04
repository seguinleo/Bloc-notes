<?php
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'])) {
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$nom = $_SESSION["nom"];
$userID = $_SESSION["userId"];
$tri = $_POST['tri'];
$trisAutorises = ["Date de création", "Date de modification", "Date de création (Z-A)", "Date de modification (Z-A)"];
if (in_array($tri, $trisAutorises) === false) {
    $tri = "Date de modification";
}
$query = $PDO->prepare("UPDATE users SET tri=:Tri WHERE nom=:CurrentUser AND id=:UserId");
$query->execute(
    [
        ':Tri'          => $tri,
        ':CurrentUser'  => $nom,
        ':UserId'       => $userID
    ]
);
$query->closeCursor();
$_SESSION['tri'] = $tri;
$PDO = null;
