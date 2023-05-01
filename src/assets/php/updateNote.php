<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_POST['title'], $_POST['filterDesc'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} 
require_once "./config.php";
require_once "./functions.php";
$descriptionConnect = htmlspecialchars($_POST['filterDesc'], ENT_QUOTES);
$descriptionConnect = encrypt_data($descriptionConnect, $_SESSION['key']);
$noteId = htmlspecialchars($_POST['noteId'], ENT_QUOTES);
$titleConnect = htmlspecialchars($_POST['title'], ENT_QUOTES);
$titleConnect = encrypt_data($titleConnect, $_SESSION['key']);
$couleurConnect = htmlspecialchars($_POST['couleur'], ENT_QUOTES);
$dateNote = htmlspecialchars($_POST['date'], ENT_QUOTES);
$hidden = htmlspecialchars($_POST['hidden'], ENT_QUOTES);
$couleursAutorisees = array("Noir", "Blanc", "Rouge", "Orange", "Jaune", "Vert", "Cyan", "BleuCiel", "Bleu", "Violet", "Rose");
if (!in_array($couleurConnect, $couleursAutorisees)) {
  $couleurConnect = "Noir";
}
$query = $PDO->prepare("UPDATE notes SET titre=:Title,content=:FilterDesc,dateNote=:DateNote,couleur=:Couleur,hiddenNote=:HiddenNote WHERE id=:NoteId AND user=:CurrentUser");
$query->execute([
  ':Title' => $titleConnect,
  ':FilterDesc' => $descriptionConnect,
  ':Couleur' => $couleurConnect,
  ':NoteId' => $noteId,
  ':DateNote' => $dateNote,
  ':CurrentUser' => $_SESSION["nom"],
  ':HiddenNote' => $hidden
]);
$query->closeCursor();
$PDO = null;
