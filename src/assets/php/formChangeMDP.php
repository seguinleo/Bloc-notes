<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION["userId"])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "./config.php";
  $mdpNew = password_hash(htmlspecialchars($_POST['mdpNew'], ENT_QUOTES), PASSWORD_DEFAULT);
  if ($mdpNew) {
    $query = $PDO->prepare("UPDATE users SET mdp=:MdpHash WHERE nom=:CurrentUser AND id=:UserId");
    $query->execute([
      ':MdpHash' => $mdpNew,
      ':CurrentUser' => $_SESSION["nom"],
      ':UserId' => $_SESSION["userId"]
    ]);
    $query->closeCursor();
  }
  $PDO = null;
}
