<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$tri = $_POST['tri'];
$trisAutorises = array("Date de création", "Date de modification", "Date de création (Z-A)", "Date de modification (Z-A)");
if (!in_array($tri, $trisAutorises)) {
    $tri = "Date de modification";
}
$query = $PDO->prepare("UPDATE users SET tri=:Tri WHERE nom=:CurrentUser AND id=:UserId");
$query->execute([
    ':Tri' => $tri,
    ':CurrentUser' => $_SESSION["nom"],
    ':UserId' => $_SESSION["userId"]
]);
$query->closeCursor();
$_SESSION['tri'] = $tri;
$PDO = null;
