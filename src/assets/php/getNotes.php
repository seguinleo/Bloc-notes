<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_SESSION['tri'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
require_once "./config.php";
require_once "./functions.php";
$tri = $_SESSION['tri'];
if ($tri == "Date de création") {
  $orderBy = "ORDER BY id DESC, titre";
} else if ($tri == "Date de modification") {
  $orderBy = "ORDER BY dateNote DESC, id DESC, titre";
} else {
  $orderBy = "ORDER BY titre";
}
$query = $PDO->prepare("SELECT id, titre, couleur, content, dateNote, hiddenNote FROM notes WHERE user=:CurrentUser $orderBy");
$query->execute([':CurrentUser' => $_SESSION["nom"]]);
$items = [];
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
  $items[] = [
    'id' => htmlspecialchars($row['id'], ENT_QUOTES),
    'title' => htmlspecialchars(decrypt_data($row['titre'], $_SESSION['key']), ENT_QUOTES),
    'couleur' => $row['couleur'],
    'desc' => htmlspecialchars(decrypt_data($row['content'], $_SESSION['key']), ENT_QUOTES),
    'date' => $row['dateNote'],
    'hidden' => $row['hiddenNote']
  ];
}
echo json_encode($items);
$query->closeCursor();
$PDO = null;
