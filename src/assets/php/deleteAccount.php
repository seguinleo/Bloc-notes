<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  $query = $PDO->prepare("DELETE FROM `TABLE_NAME` WHERE nom=:CurrentUser");
  $query->execute([':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)]);
  $query2 = $PDO->prepare("DELETE FROM `TABLE_NAME` WHERE user=:CurrentUser");
  $query2->execute([':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)]);
  session_unset();
  session_destroy();
  $query->closeCursor();
  $PDO = null;
}
