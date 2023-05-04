<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_POST['titleConnect'], $_POST['descriptionConnect'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
require_once "./config.php";
require_once "./functions.php";
$descriptionConnect = $_POST['descriptionConnect'];
$descriptionConnect = encrypt_data($descriptionConnect, $_SESSION['key']);
$titleConnect = $_POST['titleConnect'];
$titleConnect = encrypt_data($titleConnect, $_SESSION['key']);
$couleurConnect = $_POST['couleurConnect'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$couleursAutorisees = array("Noir", "Blanc", "Rouge", "Orange", "Jaune", "Vert", "Cyan", "BleuCiel", "Bleu", "Violet", "Rose");
if (!in_array($couleurConnect, $couleursAutorisees)) {
  $couleurConnect = "Noir";
}
$query = $PDO->prepare("INSERT INTO notes (titre,content,dateNote,couleur,user,hiddenNote) VALUES (:TitleConnect,:DescriptionConnect,:DateNote,:CouleurConnect,:CurrentUser,:HiddenNote)");
$query->execute([
  ':TitleConnect' => $titleConnect,
  ':DescriptionConnect' => $descriptionConnect,
  ':DateNote' => $dateNote,
  ':CouleurConnect' => $couleurConnect,
  ':CurrentUser' => $_SESSION["nom"],
  ':HiddenNote' => $hidden
]);
$query->closeCursor();
$PDO = null;
