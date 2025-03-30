<?php
session_name('secureNotes');
session_start();

$name = $_SESSION['name'];
$noteId = filter_input(INPUT_POST, 'noteId', FILTER_DEFAULT);

if (isset($name, $noteId) === false) {
    throw new Exception('Pin note failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

try {
    $query = $PDO->prepare("UPDATE notes SET pinnedNote = CASE WHEN pinnedNote = '0' THEN '1' ELSE '0' END WHERE id = :NoteId AND user = :CurrentUser");
    $query->execute(
        [
            ':NoteId'      => $noteId,
            ':CurrentUser' => $name
        ]
    );
} catch (Exception $e) {
    throw new Exception('Pin note failed');
    return;
}

$query->closeCursor();
$PDO = null;
