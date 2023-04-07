<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "./functions.php";
  $descriptionConnect = htmlspecialchars($_POST['filterDesc'], ENT_QUOTES);
  $descriptionConnect = encrypt_data($descriptionConnect, $key);
  if (strlen($descriptionConnect) >= 65535) {
    header('HTTP/2.0 403 Forbidden');
    exit();
  }
  $noteId = htmlspecialchars($_POST['noteId'], ENT_QUOTES);
  $titleConnect = htmlspecialchars($_POST['title'], ENT_QUOTES);
  $couleurConnect = htmlspecialchars($_POST['couleur'], ENT_QUOTES);
  $dateNote = $_POST['date'];
  $hidden = $_POST['hidden'];
  if ($noteId && $titleConnect && $descriptionConnect && ($couleurConnect == "Noir" || $couleurConnect == "Blanc" || $couleurConnect == "Rouge" || $couleurConnect == "Orange" || $couleurConnect == "Jaune" || $couleurConnect == "Vert" || $couleurConnect == "Cyan" || $couleurConnect == "Bleu" || $couleurConnect == "Violet")) {
    $query = $PDO->prepare("UPDATE `YOUR_TABLE` SET titre=:Title,content=:FilterDesc,dateNote=:DateNote,couleur=:Couleur,hiddenNote=:HiddenNote WHERE id=:NoteId AND user=:CurrentUser");
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
  }
  $PDO = null;
}
