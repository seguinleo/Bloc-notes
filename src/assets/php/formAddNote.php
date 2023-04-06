<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "config.php";
  require_once "functions.php";
  $descriptionConnect = htmlspecialchars($_POST['descriptionConnect'], ENT_QUOTES);
  $descriptionConnect = encrypt_data($descriptionConnect, $key);
  if (strlen($descriptionConnect) >= 65535) {
    header('HTTP/2.0 403 Forbidden');
    exit();
  }
  $titleConnect = htmlspecialchars($_POST['titleConnect'], ENT_QUOTES);
  $couleurConnect = htmlspecialchars($_POST['couleurConnect'], ENT_QUOTES);
  $dateNote = $_POST['date'];
  if ($titleConnect && $descriptionConnect && ($couleurConnect == "Noir" || $couleurConnect == "Blanc" || $couleurConnect == "Rouge" || $couleurConnect == "Orange" || $couleurConnect == "Jaune" || $couleurConnect == "Vert" || $couleurConnect == "Cyan" || $couleurConnect == "Bleu" || $couleurConnect == "Violet")) {
    $query = $PDO->prepare("INSERT INTO `TABLE_NAME` (titre,content,dateNote,couleur,user) VALUES (:TitleConnect,:DescriptionConnect,:DateNote,:CouleurConnect,:CurrentUser)");
    $query->execute([
      ':TitleConnect' => $titleConnect,
      ':DescriptionConnect' => $descriptionConnect,
      ':DateNote' => $dateNote,
      ':CouleurConnect' => $couleurConnect,
      ':CurrentUser' => $_SESSION["nom"]
    ]);
    $query->closeCursor();
  }
  $PDO = null;
}
