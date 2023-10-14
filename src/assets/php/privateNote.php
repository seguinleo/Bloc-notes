<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_SESSION['userId'], $_POST['noteId'], $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION['nom'];
$noteId = $_POST['noteId'];
$noteLink = htmlspecialchars($_POST['noteLink'], ENT_QUOTES);

try {
    $query = $PDO->prepare("UPDATE notes SET link = NULL, clearTitre = NULL, clearContent = NULL WHERE id=:NoteId AND user=:CurrentUser AND link=:NoteLink");
    $query->execute(
        [
            ':NoteLink'    => $noteLink,
            ':NoteId'      => $noteId,
            ':CurrentUser' => $nom
        ]
    );
    $query->closeCursor();
    $PDO = null;
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$directoryPath = '../../share/' . $noteLink;
if (file_exists($directoryPath)) {
    array_map('unlink', glob("$directoryPath/*"));
    if (rmdir($directoryPath)) {
        http_response_code(200);
        return;
    } else {
        http_response_code(403);
        return;
    }
} else {
    http_response_code(500);
    return;
}
