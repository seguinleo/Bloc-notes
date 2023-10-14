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
$title = $_POST['title'];
$desc = $_POST['desc'];
$noteLink = htmlspecialchars($_POST['noteLink'], ENT_QUOTES);

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
if (is_dir($directoryPath) === false) {
    if (mkdir($directoryPath)) {
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
            <meta name="theme-color" content="#272727">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="#272727">
            <link rel="stylesheet" href="../stylePublic.css">
            <link rel="stylesheet" href="/assets/fontawesome/css/all.min.css">
        </head>
        <body>
            <main data-link="%s"></main>
            <footer>
                <a href="../../" target="_blank" rel="noreferrer">
                    Bloc-notes &#8211; Léo SEGUIN
                </a>
                GPL-3.0 &copy;<?= date('Y') ?>
            </footer>
            <script src="../../assets/js/showdown.min.js" defer></script>
            <script src="../scriptPublic.js" defer></script>
        </body>
        </html>
        EOT;
        $indexContent = sprintf($indexContent, $noteLink);
        fwrite($index, $indexContent);
        fclose($index);
    } else {
        http_response_code(403);
        return;
    }
} else {
    http_response_code(500);
    return;
}
