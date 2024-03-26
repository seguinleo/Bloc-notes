<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/class/Encryption.php';

global $PDO;
$link = $_POST['noteLink'];
$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("
        SELECT notes.title, notes.content, notes.dateNote, notes.link, users.oneKey
        FROM notes
        INNER JOIN users ON notes.user = users.name
        WHERE notes.link = :NoteLink
        LIMIT 1
    ");
    $query->execute([':NoteLink' => $link]);
    $row = $query->fetch();
    if ($row === false) {
        http_response_code(404);
        return;
    }
    $note = [
        'title'     => $encryption->decryptData($row['title'], $row['oneKey']),
        'content'   => $encryption->decryptData($row['content'], $row['oneKey']),
        'date'      => $row['dateNote']
    ];
} catch (Exception $e) {
    throw new Exception('Note retrieval failed');
    return;
}

echo json_encode($note);
$query->closeCursor();
$PDO = null;
