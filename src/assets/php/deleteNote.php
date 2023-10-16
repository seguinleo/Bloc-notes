<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_POST['noteId']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[0-9]+$/', $_SESSION['noteId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION['nom'];
$noteId = $_POST['noteId'];

try {
    $query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser AND link IS NULL");
    $query->execute(
        [
            ':NoteId'      => $noteId,
            ':CurrentUser' => $nom
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
