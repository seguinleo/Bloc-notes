<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) && !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "config.php";
  require_once "functions.php";
  if ($_SESSION['tri_secure'] == "Date de création") {
    $query = $PDO->prepare("SELECT * FROM notes WHERE user=:CurrentUser ORDER BY id DESC, titre");
  } else if ($_SESSION['tri_secure'] == "Date de modification") {
    $query = $PDO->prepare("SELECT * FROM notes WHERE user=:CurrentUser ORDER BY dateNote DESC, id DESC, titre");
  } else {
    $query = $PDO->prepare("SELECT * FROM notes WHERE user=:CurrentUser ORDER BY titre");
  }
  $query->execute([':CurrentUser' => $_SESSION["nom"]]);
  $items = array();
  while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $desc = decrypt_data($row['content'], $key);
    $item = array(
      'id' => $row['id'],
      'title' => $row['titre'],
      'couleur' => $row['couleur'],
      'desc' => $desc,
      'date' => $row['dateNote']
    );
    array_push($items, $item);
  }
  echo json_encode($items);
  $query->closeCursor();
  $PDO = null;
}
