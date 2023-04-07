<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "./config.php";
  $query = $PDO->prepare("DELETE FROM `YOUR_TABLE` WHERE nom=:CurrentUser AND id=:UserId");
  $query->execute([
    ':CurrentUser' => $_SESSION["nom"],
    ':UserId' => $_SESSION["userId"]
  ]);
  session_unset();
  session_destroy();
  $query->closeCursor();
  $PDO = null;
}
