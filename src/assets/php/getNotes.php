<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/functions.php';
$tri = $_SESSION['tri'];
if ($tri === "Date de création") {
    $orderBy = "ORDER BY id DESC";
} else if ($tri === "Date de création (Z-A)") {
    $orderBy = "ORDER BY id";
} else if ($tri === "Date de modification") {
    $orderBy = "ORDER BY dateNote DESC, id DESC";
} else {
    $orderBy = "ORDER BY dateNote, id DESC";
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
