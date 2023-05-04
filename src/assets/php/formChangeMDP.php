<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION["userId"], $_POST['mdpNew'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
require_once "./config.php";
$mdpNew = password_hash($_POST['mdpNew'], PASSWORD_DEFAULT);
$query = $PDO->prepare("UPDATE users SET mdp=:MdpHash WHERE nom=:CurrentUser AND id=:UserId");
$query->execute([
  ':MdpHash' => $mdpNew,
  ':CurrentUser' => $_SESSION["nom"],
  ':UserId' => $_SESSION["userId"]
]);
$query->closeCursor();
$PDO = null;
