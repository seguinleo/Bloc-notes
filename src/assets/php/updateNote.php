<?php
global $PDO, $name, $key;
require_once __DIR__ . '/getKey.php';

if (isset($_POST['noteId'], $_POST['title'], $_POST['content'], $_POST['date'], $_POST['color'], $_POST['hidden']) === false) {
    http_response_code(403);
    return;
}
if (is_numeric($_POST['noteId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

$noteId = $_POST['noteId'];
$title = $_POST['title'];
$content = $_POST['content'];
$color = $_POST['color'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$category = $_POST['category'];
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
$allCategories = ["0","1","2","3","4","5","6"];

if (in_array($color, $allColors) === false) $color = 'Noir';
if (in_array($category, $allCategories) === false) $category = '0';

try {
    $query = $PDO->prepare("UPDATE notes SET title=:Title,content=:Content,dateNote=:DateNote,color=:Color,hiddenNote=:HiddenNote,category=:Category WHERE id=:NoteId AND user=:User");
    $query->execute(
        [
            ':NoteId'     => $noteId,
            ':Title'      => $encryption->encryptData($title, $key),
            ':Content'    => $encryption->encryptData($content, $key),
            ':Color'      => $color,
            ':DateNote'   => $dateNote,
            ':HiddenNote' => $hidden,
            ':Category'   => $category,
            ':User'       => $name
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
