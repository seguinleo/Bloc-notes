<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_POST['noteId'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser");
$query->execute([
    ':NoteId' => $_POST['noteId'],
    ':CurrentUser' => $_SESSION["nom"]
]);
$query->closeCursor();
$PDO = null;
