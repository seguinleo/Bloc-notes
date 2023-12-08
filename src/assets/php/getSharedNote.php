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
    $query = $PDO->prepare("SELECT users.oneKey FROM users,notes WHERE notes.link=:NoteLink AND notes.user=users.name LIMIT 1");
    $query->execute([':NoteLink' => $noteLink]);
    $key = $query->fetch()['oneKey'];
} catch (Exception $e) {
    http_response_code(404);
    return;
}

$query->closeCursor();

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("SELECT title,content,dateNote,color FROM notes WHERE link=:NoteLink LIMIT 1");
    $query->execute([':NoteLink' => $noteLink]);
    $row = $query->fetch();
    $items[] = [
        'title'   => $encryption->decryptData($row['title'], $key),
        'content'    => $encryption->decryptData($row['content'], $key),
        'date'    => $row['dateNote'],
        'color' => $row['color']
    ];
} catch (Exception $e) {
    http_response_code(404);
    return;
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
