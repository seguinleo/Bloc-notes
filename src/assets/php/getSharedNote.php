<?php
require_once __DIR__ . '/config/config.php';

$noteLink = $_POST['noteLink'];

$query = $PDO->prepare("SELECT clearTitle, clearContent, dateNote, couleur, link, user FROM notes WHERE link=:NoteLink");
$query->execute([':NoteLink' => $noteLink]);
$items = [];

while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $items[] = [
        'title'   => $row['clearTitle'],
        'desc'    => $row['clearContent'],
        'date'    => $row['dateNote'],
        'couleur' => $row['couleur'],
        'user'    => $row['user']
    ];
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
