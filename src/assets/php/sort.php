<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
require_once "./config.php";
$tri = $_POST['tri'];
$trisAutorises = array("Titre", "Date de création", "Date de modification");
if (!in_array($tri, $trisAutorises)) {
  $tri = "Titre";
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
