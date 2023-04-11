<?php
session_name('__Secure-PHPSESSID');
session_start();
if ($_POST['csrf_token_creer'] !== $_SESSION['csrf_token_creer']) {
  header('HTTP/2.0 500 Internal Server');
  exit();
}
if (isset($_SESSION["nom"]) || isset($_SESSION['userId'])) {
  header('HTTP/2.0 500 Internal Server');
  exit();
}
require_once "./config.php";
$nomCreer = htmlspecialchars($_POST['nomCreer'], ENT_QUOTES);
$mdpCreer = password_hash(htmlspecialchars($_POST['mdpCreer'], ENT_QUOTES), PASSWORD_DEFAULT);
$key = openssl_random_pseudo_bytes(32);
if ($nomCreer && $mdpCreer) {
  $query = $PDO->prepare("INSERT INTO users (nom,mdp,one_key) VALUES (:NomCreer,:MdpHash,:OneKey)");
  $query->execute([':NomCreer' => $nomCreer, ':MdpHash' => $mdpCreer, ':OneKey' => $key]);
  $query->closeCursor();
}
$PDO = null;
