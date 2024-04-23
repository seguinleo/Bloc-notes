<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$noteId = filter_input(INPUT_POST, 'noteId', FILTER_DEFAULT);

if (filter_input(INPUT_POST, 'csrf_token', FILTER_DEFAULT) !== $_SESSION['csrf_token']) {
    throw new Exception('Connection timeout, please reload the page');
    return;
}
if (isset($name, $noteId) === false) {
    throw new Exception('Note modification failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$noteLink = bin2hex(random_bytes(12));

try {
    $query = $PDO->prepare("UPDATE notes SET link=:NoteLink WHERE id=:NoteId AND user=:CurrentUser AND link IS NULL");
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
