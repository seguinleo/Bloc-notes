<?php
session_name('__Secure-notes');
session_start();

if (!isset($_SESSION["nom"], $_SESSION['userId'], $_SESSION["tri"], $_SESSION["key"])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/class/Encryption.php';

$encryption = new Encryption\Encryption();

$nom = $_SESSION["nom"];
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
$query->execute([':CurrentUser' => $nom]);
$items = [];

while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $items[] = [
        'id'        => $row['id'],
        'title'     => $encryption->decryptData($row['titre'], $key),
        'couleur'   => $row['couleur'],
        'desc'      => $encryption->decryptData($row['content'], $key),
        'date'      => $row['dateNote'],
        'hidden'    => $row['hiddenNote']
    ];
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
