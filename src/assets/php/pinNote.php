<?php
session_name('__Secure-notes');
session_start();

if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Pin note failed');
    return;
}
if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['noteId']) === false) {
    throw new Exception('Pin note failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$noteId = $_POST['noteId'];

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
