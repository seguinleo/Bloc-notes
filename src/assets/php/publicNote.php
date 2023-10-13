<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_SESSION['userId'], $_POST['noteId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION['nom'];
$noteId = $_POST['noteId'];
$noteLink = $_POST['noteLink'];
$key = $_SESSION['key'];
$title = $_POST['title'];
$desc = $_POST['desc'];

try {
    $query = $PDO->prepare("UPDATE notes SET link=:NoteLink, clearTitle=:ClearTitle, clearContent=:ClearContent WHERE id=:NoteId AND user=:CurrentUser AND link IS NULL");
    $query->execute(
        [
            ':NoteLink'     => $noteLink,
            ':NoteId'       => $noteId,
            ':CurrentUser'  => $nom,
            ':ClearTitle'   => $title,
            ':ClearContent' => $desc
        ]
    );
    $query->closeCursor();
    $PDO = null;
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$directoryPath = '../../share/' . $noteLink;
if (!file_exists($directoryPath)) {
    if (mkdir($directoryPath, 0755, true)) {
        $index = fopen($directoryPath . '/index.php', 'w');
        $indexContent =
        <<<EOT
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="robots" content="noindex, nofollow">
            <title>Bloc-notes &#8211; Léo SEGUIN</title>
            <link rel="shortcut icon" href="../../favicon.ico" type="image/x-icon">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="theme-color" content="#272727" id="themecolor">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="#272727">
            <link rel="stylesheet" href="../stylePublic.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
        </head>
        <body>
            <main data-link="%s"></main>
            <footer>
                <a href="../../" target="_blank" rel="noreferrer" aria-label="Vers le site">
                    Bloc-notes &#8211; Léo SEGUIN
                </a>
                <span class="license">GPL-3.0 &copy;<?= date('Y') ?></span>
            </footer>
            <script src="../../assets/js/showdown.min.js" defer></script>
            <script src="../scriptPublic.js" defer></script>
        </body>
        </html>
        EOT;
        $indexContent = sprintf($indexContent, $noteLink);
        fwrite($index, $indexContent);
    } else {
        http_response_code(403);
        return;
    }
} else {
    http_response_code(500);
    return;
}
