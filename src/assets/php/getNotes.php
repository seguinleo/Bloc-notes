<?php
session_start();
if (isset($_SESSION["nom"]) === false) {
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/functions.php';
$tri = $_SESSION['tri'];
$key = $_SESSION['key'];
if ($tri === "Date de création") {
    $orderBy = "ORDER BY id DESC";
} elseif ($tri === "Date de création (Z-A)") {
    $orderBy = "ORDER BY id";
} elseif ($tri === "Date de modification") {
    $orderBy = "ORDER BY dateNote DESC, id DESC";
} else {
    $orderBy = "ORDER BY dateNote, id DESC";
}
$query = $PDO->prepare("SELECT id, titre, couleur, content, dateNote, hiddenNote FROM notes WHERE user=:CurrentUser $orderBy");
$query->execute([':CurrentUser' => $_SESSION["nom"]]);
$items = [];
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $items[] = [
        'id'        => htmlspecialchars($row['id'], ENT_QUOTES),
        'title'     => htmlspecialchars(decrypt_data($row['titre'], $key), ENT_QUOTES),
        'couleur'   => $row['couleur'],
        'desc'      => htmlspecialchars(decrypt_data($row['content'], $key), ENT_QUOTES),
        'date'      => $row['dateNote'],
        'hidden'    => $row['hiddenNote']
    ];
}
echo json_encode($items);
$query->closeCursor();
$PDO = null;
