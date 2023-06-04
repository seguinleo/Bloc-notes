<?php
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_POST['noteId'])) {
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
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
