<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "config.php";
  $query = $PDO->prepare("DELETE FROM users WHERE nom=:CurrentUser AND id=:UserId");
  $query->execute([
    ':CurrentUser' => $_SESSION["nom"],
    ':UserId' => $_SESSION["userId"]
  ]);
  $query2 = $PDO->prepare("DELETE FROM notes WHERE user=:CurrentUser");
  $query2->execute([':CurrentUser' => $_SESSION["nom"]]);
  session_unset();
  session_destroy();
  $query->closeCursor();
  $PDO = null;
}
