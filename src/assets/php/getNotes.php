<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  require_once "functions.php";
  $query = $PDO->prepare("SELECT * FROM `YOUR_TABLE` WHERE user=:CurrentUser ORDER BY id DESC");
  $query->execute([':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)]);
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
