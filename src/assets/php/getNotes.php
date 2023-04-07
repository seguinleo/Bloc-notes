<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_SESSION['tri'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require "./functions.php";
  if ($_SESSION['tri'] == "Date de création") {
    $orderBy = "ORDER BY id DESC, titre";
  } else if ($_SESSION['tri'] == "Date de modification") {
    $orderBy = "ORDER BY dateNote DESC, id DESC, titre";
  } else {
    $orderBy = "ORDER BY titre";
  }
  $query = $PDO->prepare("SELECT id, titre, couleur, content, dateNote, hiddenNote FROM `YOUR_TABLE` WHERE user=:CurrentUser $orderBy LIMIT 150");
  $query->execute([':CurrentUser' => $_SESSION["nom"]]);
  $items = [];
  while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $desc = decrypt_data($row['content'], $key);
    $items[] = [
      'id' => $row['id'],
      'title' => $row['titre'],
      'couleur' => $row['couleur'],
      'desc' => $desc,
      'date' => $row['dateNote'],
      'hidden' => $row['hiddenNote']
    ];
  }
  echo json_encode($items);
  $query->closeCursor();
  $PDO = null;
}
