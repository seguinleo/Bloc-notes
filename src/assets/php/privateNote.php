<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name'], $_POST['noteId'], $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-z0-9]+$/', $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$name = $_SESSION['name'];
$noteId = $_POST['noteId'];
$noteLink = $_POST['noteLink'];

try {
    $query = $PDO->prepare("UPDATE notes SET link = NULL WHERE id=:NoteId AND user=:CurrentUser AND link=:NoteLink");
    $query->execute(
        [
            ':NoteLink'     => $noteLink,
            ':NoteId'       => $noteId,
            ':CurrentUser'  => $name
        ]
    );
    $query->closeCursor();
    $PDO = null;
    if ($query->rowCount() === 0) {
        http_response_code(403);
        return;
    }
    $directoryPath = '../../share/' . htmlspecialchars($noteLink);
    if (is_dir($directoryPath)) {
        $files = glob($directoryPath . '/*.*');
        if ($files === false) {
            http_response_code(403);
            return;
        }
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
} catch (Exception $e) {
    http_response_code(500);
    return;
}
