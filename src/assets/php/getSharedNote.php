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
    $query = $PDO->prepare("SELECT users.one_key FROM users,notes WHERE notes.link=:NoteLink AND notes.user=users.nom LIMIT 1");
    $query->execute([':NoteLink' => $noteLink]);
    $key = $query->fetch(PDO::FETCH_ASSOC)['one_key'];
} catch (Exception $e) {
    http_response_code(404);
    return;
}

$query->closeCursor();

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("SELECT titre,content,dateNote,couleur FROM notes WHERE link=:NoteLink LIMIT 1");
    $query->execute([':NoteLink' => $noteLink]);
    $row = $query->fetch(PDO::FETCH_ASSOC);
    $items[] = [
        'title'   => $encryption->decryptData($row['titre'], $key),
        'desc'    => $encryption->decryptData($row['content'], $key),
        'date'    => $row['dateNote'],
        'couleur' => $row['couleur']
    ];
} catch (Exception $e) {
    http_response_code(404);
    return;
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
