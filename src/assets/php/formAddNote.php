<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "./config.php";
  require_once "./functions.php";
  if (!isset($_POST['titleConnect']) || !isset($_POST['descriptionConnect'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
  }
  $descriptionConnect = htmlspecialchars($_POST['descriptionConnect'], ENT_QUOTES);
  $descriptionConnect = encrypt_data($descriptionConnect, $_SESSION['key']);
  if (strlen($descriptionConnect) >= 65535) {
    header('HTTP/2.0 403 Forbidden');
    exit();
  }
  $titleConnect = htmlspecialchars($_POST['titleConnect'], ENT_QUOTES);
  $couleurConnect = $_POST['couleurConnect'];
  $dateNote = $_POST['date'];
  $hidden = $_POST['hidden'];
  if ($titleConnect && $descriptionConnect && ($couleurConnect == "Noir" || $couleurConnect == "Blanc" || $couleurConnect == "Rouge" || $couleurConnect == "Orange" || $couleurConnect == "Jaune" || $couleurConnect == "Vert" || $couleurConnect == "Cyan" || $couleurConnect == "Bleu" || $couleurConnect == "Violet")) {
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
  }
  $PDO = null;
}
