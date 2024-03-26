<?php
session_name('__Secure-notes');
session_start();

if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Note modification failed');
    return;
}
if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['noteId']) === false) {
    throw new Exception('Note modification failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$noteId = $_POST['noteId'];
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
