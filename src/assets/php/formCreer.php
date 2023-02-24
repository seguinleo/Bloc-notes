<?php
session_name('__Secure-PHPSESSID');
session_start();
if (isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  $nomCreer = htmlspecialchars($_POST['nomCreer'], ENT_QUOTES);
  $mdpCreer = password_hash(htmlspecialchars($_POST['mdpCreer'], ENT_QUOTES), PASSWORD_DEFAULT);
  if ($nomCreer && $mdpCreer) {
    $query = $PDO->prepare("INSERT INTO `TABLE_NAME` (nom, mdp) VALUES (:NomCreer,:MdpHash)");
    $query->execute([':NomCreer' => $nomCreer, ':MdpHash' => $mdpCreer]);
    $query->closeCursor();
  }
  $PDO = null;
}
