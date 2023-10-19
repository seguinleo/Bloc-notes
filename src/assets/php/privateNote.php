<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_POST['noteId'], $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[0-9]+$/', $_SESSION['noteId']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-z0-9]+$/', $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION['nom'];
$noteId = $_POST['noteId'];
$noteLink = $_POST['noteLink'];

try {
    $query = $PDO->prepare("UPDATE notes SET link = NULL WHERE id=:NoteId AND user=:CurrentUser AND link=:NoteLink");
    $query->execute(
        [
            ':NoteLink'     => $noteLink,
            ':NoteId'       => $noteId,
            ':CurrentUser'  => $nom
        ]
    );
    $query->closeCursor();
    $PDO = null;
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$directoryPath = '../../share/' . htmlspecialchars($noteLink);
if (is_dir($directoryPath)) {
    $files = glob($directoryPath . '/*.*');
    foreach ($files as $file) {
        unlink($file);
    }
    if (rmdir($directoryPath)) {
        http_response_code(200);
        return;
    } else {
        http_response_code(403);
        return;
    }
} else {
    http_response_code(404);
    return;
}
