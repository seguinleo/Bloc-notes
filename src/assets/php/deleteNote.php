<?php
session_name('__Secure-notes');
session_start();

if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Note deletion failed');
    return;
}
if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['noteId']) === false) {
    throw new Exception('Note deletion failed');
    return;
}
if (ctype_alnum($_SESSION['name']) === false || is_int($_SESSION['userId']) === false || is_numeric($_POST['noteId']) === false) {
    throw new Exception('Note deletion failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$noteId = $_POST['noteId'];

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
