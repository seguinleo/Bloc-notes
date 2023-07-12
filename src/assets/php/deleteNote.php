<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION["nom"], $_SESSION['userId'], $_POST['noteId']) === false) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config/config.php';

$nom = $_SESSION["nom"];
$noteId = $_POST['noteId'];
$query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser");
$query->execute(
    [
        ':NoteId' => $noteId,
        ':CurrentUser' => $nom
    ]
);

$query->closeCursor();
$PDO = null;
