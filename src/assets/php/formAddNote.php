<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  require_once "functions.php";
  $titleConnect = htmlspecialchars($_POST['titleConnect'], ENT_QUOTES);
  $couleurConnect = htmlspecialchars($_POST['couleurConnect'], ENT_QUOTES);
  $descriptionConnect = htmlspecialchars($_POST['descriptionConnect'], ENT_QUOTES);
  $descriptionConnect = encrypt_data($descriptionConnect, $key);
  $dateNote = date('d/m/Y');
  if ($titleConnect && $descriptionConnect && ($couleurConnect == "Noir" || $couleurConnect == "Rouge" || $couleurConnect == "Orange" || $couleurConnect == "Jaune" || $couleurConnect == "Vert" || $couleurConnect == "Cyan" || $couleurConnect == "Bleu" || $couleurConnect == "Violet")) {
    $query = $PDO->prepare("INSERT INTO `YOUR_TABLE` (titre,content,dateNote,couleur,user) VALUES (:TitleConnect,:DescriptionConnect,:DateNote,:CouleurConnect,:CurrentUser)");
    $query->execute([
      ':TitleConnect' => $titleConnect,
      ':DescriptionConnect' => $descriptionConnect,
      ':DateNote' => $dateNote,
      ':CouleurConnect' => $couleurConnect,
      ':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)
    ]);
    $query->closeCursor();
  }
  $PDO = null;
}
