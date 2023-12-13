<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name'], $_SESSION['userId'], $_POST['noteId']) === false) {
    http_response_code(403);
    return;
}
if (is_string($_SESSION['name']) === false || is_int($_SESSION['userId']) === false || is_numeric($_POST['noteId']) === false) {
    http_response_code(403);
    return;
}

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
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
