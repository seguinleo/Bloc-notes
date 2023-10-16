<?php
if (empty($_POST['noteLink'])) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-z0-9]+$/', $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$noteLink = $_POST['noteLink'];

try {
    $query = $PDO->prepare("SELECT clearTitre, clearContent, dateNote, couleur, link FROM notes WHERE link=:NoteLink");
    $query->execute([':NoteLink' => $noteLink]);
    $items = [];

    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        $items[] = [
            'title'   => $row['clearTitre'],
            'desc'    => $row['clearContent'],
            'date'    => $row['dateNote'],
            'couleur' => $row['couleur']
        ];
    }
} catch (Exception $e) {
    http_response_code(404);
    return;
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
