<?php
global $PDO, $name, $key;
require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();
$noteId = filter_input(INPUT_POST, 'noteId', FILTER_DEFAULT);
$title = filter_input(INPUT_POST, 'title', FILTER_DEFAULT);
$content = filter_input(INPUT_POST, 'content', FILTER_DEFAULT);
$color = filter_input(INPUT_POST, 'color', FILTER_DEFAULT);
$dateNote = date('Y-m-d H:i:s');
$hidden = filter_input(INPUT_POST, 'hidden', FILTER_SANITIZE_NUMBER_INT);
$category = filter_input(INPUT_POST, 'category', FILTER_SANITIZE_NUMBER_INT);
$allColors = [
    'bg-default',
    'bg-red',
    'bg-orange',
    'bg-yellow',
    'bg-green',
    'bg-cyan',
    'bg-light-blue',
    'bg-blue',
    'bg-purple',
    'bg-pink'
];
$allCategories = ['0','1','2','3','4','5','6'];

if (in_array($color, $allColors) === false) $color = 'bg-default';
if (in_array($category, $allCategories) === false) $category = '0';

try {
    $query = $PDO->prepare("UPDATE notes SET title=:Title,content=:Content,dateNote=:DateNote,color=:Color,hiddenNote=:HiddenNote,category=:Category WHERE id=:NoteId AND user=:User");
    $query->execute(
        [
            ':NoteId'       => $noteId,
            ':Title'        => $encryption->encryptData($title, $key),
            ':Content'      => $encryption->encryptData($content, $key),
            ':Color'        => $color,
            ':DateNote'     => $dateNote,
            ':HiddenNote'   => $hidden,
            ':Category'     => $category,
            ':User'         => $name
        ]
    );
} catch (Exception $e) {
    throw new Exception('Update failed');
    return;
}

$query->closeCursor();
$PDO = null;
