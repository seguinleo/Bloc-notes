<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  $mdpNew = password_hash(htmlspecialchars($_POST['mdpNew'], ENT_QUOTES), PASSWORD_DEFAULT);
  if ($mdpNew) {
    $query = $PDO->prepare("UPDATE `TABLE_NAME` SET mdp=:MdpHash WHERE nom=:CurrentUser");
    $query->execute([':MdpHash' => $mdpNew, ':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)]);
    $query->closeCursor();
  }
  $PDO = null;
}
