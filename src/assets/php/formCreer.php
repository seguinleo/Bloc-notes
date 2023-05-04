<?php
session_name('__Secure-PHPSESSID');
session_start();
if ($_POST['csrf_token_creer'] !== $_SESSION['csrf_token_creer'] || !isset($_POST['nomCreer'], $_POST['mdpCreer']) || isset($_SESSION["nom"], $_SESSION['userId'])) {
  header('HTTP/2.0 500 Internal Server');
  exit();
}
require_once "./config.php";
$nomCreer = $_POST['nomCreer'];
$mdpCreer = password_hash($_POST['mdpCreer'], PASSWORD_DEFAULT);
$key = openssl_random_pseudo_bytes(32);
$query = $PDO->prepare("INSERT INTO users (nom,mdp,one_key) VALUES (:NomCreer,:MdpHash,:OneKey)");
$query->execute([':NomCreer' => $nomCreer, ':MdpHash' => $mdpCreer, ':OneKey' => $key]);
$query->closeCursor();
$PDO = null;
