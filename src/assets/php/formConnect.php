<?php
session_name('__Secure-PHPSESSID');
session_start();
if ($_POST['csrf_token_connect'] !== $_SESSION['csrf_token_connect'] || !isset($_POST['nomConnect'], $_POST['mdpConnect']) || isset($_SESSION["nom"], $_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
require_once "./config.php";
$nomConnect = $_POST['nomConnect'];
$mdpConnect = $_POST['mdpConnect'];
$query = $PDO->prepare("SELECT * FROM users WHERE nom=:NomConnect");
$query->execute([':NomConnect' => $nomConnect]);
$row = $query->fetch(PDO::FETCH_ASSOC);
if (!password_verify($mdpConnect, $row['mdp'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
$_SESSION['nom'] = $row['nom'];
$_SESSION['userId'] = $row['id'];
$_SESSION['tri'] = $row['tri'];
$_SESSION['key'] = $row['one_key'];
$query->closeCursor();
$PDO = null;
