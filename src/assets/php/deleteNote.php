<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_SESSION['userId'], $_POST['noteId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION['nom'];
$noteId = $_POST['noteId'];
$query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser");
$query->execute(
    [
        ':NoteId'      => $noteId,
        ':CurrentUser' => $nom
    ]
);
$query->closeCursor();
$PDO = null;
