<?php
session_name('secureNotes');
session_start();

if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Connection timeout, please reload the page and try again');
    return;
}
if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['noteId'], $_POST['noteLink']) === false) {
    throw new Exception('Note modification failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$noteId = $_POST['noteId'];
$noteLink = $_POST['noteLink'];

try {
    $query = $PDO->prepare("UPDATE notes SET link=NULL WHERE id=:NoteId AND user=:CurrentUser AND link=:NoteLink");
    $query->execute(
        [
            ':NoteLink'     => $noteLink,
            ':NoteId'       => $noteId,
            ':CurrentUser'  => $name
        ]
    );
    $query->closeCursor();
    $PDO = null;
} catch (Exception $e) {
    throw new Exception('Note modification failed');
    return;
}
