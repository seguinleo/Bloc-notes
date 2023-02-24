<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  require_once "functions.php";
  $noteId = htmlspecialchars($_POST['noteId'], ENT_QUOTES);
  $title = htmlspecialchars($_POST['title'], ENT_QUOTES);
  $couleur = htmlspecialchars($_POST['couleur'], ENT_QUOTES);
  $filterDesc = htmlspecialchars($_POST['filterDesc'], ENT_QUOTES);
  $filterDesc = encrypt_data($filterDesc, $key);
  $dateNote = date('d/m/Y');
  if ($noteId && $title && $filterDesc && ($couleur == "Noir" || $couleur == "Rouge" || $couleur == "Jaune" || $couleur == "Vert" || $couleur == "Bleu" || $couleur == "Violet")) {
    $query = $PDO->prepare("UPDATE `TABLE_NAME` SET titre=:Title, content=:FilterDesc, dateNote=:DateNote, couleur=:Couleur WHERE id=:NoteId AND user=:CurrentUser");
    $query->execute([
      ':Title' => $title,
      ':FilterDesc' => $filterDesc,
      ':Couleur' => $couleur,
      ':NoteId' => $noteId,
      ':DateNote' => $dateNote,
      ':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)
    ]);
    $query->closeCursor();
  }
  $PDO = null;
}
