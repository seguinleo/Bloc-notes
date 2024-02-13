<?php
if (empty($_POST['noteLink'])) {
    throw new Exception('Note retrieval failed');
    return;
}
if (ctype_alnum($_POST['noteLink']) === false) {
    throw new Exception('Note retrieval failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$link = $_POST['noteLink'];

try {
    $query = $PDO->prepare("SELECT users.oneKey FROM users,notes WHERE notes.link=:NoteLink AND notes.user=users.name LIMIT 1");
    $query->execute([':NoteLink' => $link]);
    $key = $query->fetch()['oneKey'];
} catch (Exception $e) {
    throw new Exception('Note retrieval failed');
    return;
}

$query->closeCursor();

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("SELECT title,content,dateNote FROM notes WHERE link=:NoteLink LIMIT 1");
    $query->execute([':NoteLink' => $link]);
    $row = $query->fetch();
    $note = [
        'title'     => $encryption->decryptData($row['title'], $key),
        'content'   => $encryption->decryptData($row['content'], $key),
        'date'      => $row['dateNote']
    ];
} catch (Exception $e) {
    throw new Exception('Note retrieval failed');
    return;
}

echo json_encode($note);
$query->closeCursor();
$PDO = null;
