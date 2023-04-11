<?php
session_name('__Secure-PHPSESSID');
session_start();
if ($_POST['csrf_token_connect'] !== $_SESSION['csrf_token_connect']) {
  header('HTTP/2.0 500 Internal Server');
  exit();
}
if (isset($_SESSION["nom"]) || isset($_SESSION['userId'])) {
  header('HTTP/2.0 500 Internal Server');
  exit();
}
require_once "./config.php";
$nomConnect = htmlspecialchars($_POST['nomConnect'], ENT_QUOTES);
$mdpConnect = htmlspecialchars($_POST['mdpConnect'], ENT_QUOTES);
if ($nomConnect && $mdpConnect) {
  $query = $PDO->prepare("SELECT * FROM users WHERE nom=:NomConnect");
  $query->execute([':NomConnect' => $nomConnect]);
  $row = $query->fetch(PDO::FETCH_ASSOC);
  if (password_verify($mdpConnect, $row['mdp'])) {
    $_SESSION['nom'] = $row['nom'];
    $_SESSION['userId'] = $row['id'];
    $_SESSION['tri'] = $row['tri'];
    $_SESSION['key'] = $row['one_key'];
  } else {
    header('HTTP/2.0 500 Internal Server');
  }
  $query->closeCursor();
} else {
  header('HTTP/2.0 400 Bad Request');
}
$PDO = null;
