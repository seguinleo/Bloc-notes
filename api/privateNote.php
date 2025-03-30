<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$noteId = filter_input(INPUT_POST, 'noteId', FILTER_DEFAULT);
$noteLink = filter_input(INPUT_POST, 'noteLink', FILTER_DEFAULT);

if (isset($name, $noteId, $noteLink) === false) {
    throw new Exception('Note modification failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

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
