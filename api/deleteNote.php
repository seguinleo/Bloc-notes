<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$noteId = filter_input(INPUT_POST, 'noteId', FILTER_DEFAULT);

if (isset($name, $noteId) === false) {
    throw new Exception('Note deletion failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

try {
    $query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser AND link IS NULL");
    $query->execute(
        [
            ':NoteId'      => $noteId,
            ':CurrentUser' => $name
        ]
    );
} catch (Exception $e) {
    throw new Exception('Note deletion failed');
    return;
}

$query->closeCursor();
$PDO = null;
