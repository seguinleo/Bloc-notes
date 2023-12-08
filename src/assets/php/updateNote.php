<?php
require_once __DIR__ . '/getKey.php';

if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note']) {
    http_response_code(403);
    return;
}
if (isset($_SESSION['name'], $_POST['noteId'], $_POST['title'], $_POST['content'], $_POST['date'], $_POST['color'], $_POST['hidden']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

$noteId = $_POST['noteId'];
$title = $_POST['title'];
$titleEncrypted = $encryption->encryptData($title, $key);
$content = $_POST['content'];
$contentEncrypted = $encryption->encryptData($content, $key);
$color = $_POST['color'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$allColors = [
    "Noir",
    "Rouge",
    "Orange",
    "Jaune",
    "Vert",
    "Cyan",
    "BleuCiel",
    "Bleu",
    "Violet",
    "Rose"
];

if (in_array($color, $allColors) === false) $color = 'Noir';

try {
    $query = $PDO->prepare("UPDATE notes SET title=:Title,content=:Content,dateNote=:DateNote,color=:Color,hiddenNote=:HiddenNote WHERE id=:NoteId AND user=:User");
    $query->execute(
        [
            ':NoteId'     => $noteId,
            ':Title'      => $titleEncrypted,
            ':Content'    => $contentEncrypted,
            ':Color'      => $color,
            ':DateNote'   => $dateNote,
            ':HiddenNote' => $hidden,
            ':User'       => $name
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
