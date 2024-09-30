<?php
global $PDO, $name, $key;
require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();
$noteId = bin2hex(random_bytes(12));
$title = filter_input(INPUT_POST, 'title', FILTER_DEFAULT);
$content = filter_input(INPUT_POST, 'content', FILTER_DEFAULT);
$color = filter_input(INPUT_POST, 'color', FILTER_DEFAULT);
$dateNote = date('Y-m-d H:i:s');
$hidden = filter_input(INPUT_POST, 'hidden', FILTER_SANITIZE_NUMBER_INT);
$folder = filter_input(INPUT_POST, 'folder', FILTER_DEFAULT) ?? null;
$category = filter_input(INPUT_POST, 'category', FILTER_DEFAULT) ?? null;
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
    'bg-pink',
];

if (in_array($color, $allColors) === false) $color = 'bg-default';

try {
    $query = $PDO->prepare("INSERT INTO notes (id,title,content,dateNote,color,hiddenNote,folder,category,user) VALUES (:NoteId,:Title,:Content,:DateNote,:Color,:HiddenNote,:Folder,:Category,:User)");
    $query->execute(
        [
            ':NoteId'       => $noteId,
            ':Title'        => $encryption->encryptData($title, $key),
            ':Content'      => $encryption->encryptData($content, $key),
            ':Color'        => $color,
            ':DateNote'     => $dateNote,
            ':HiddenNote'   => $hidden,
            ':Folder'       => $folder,
            ':Category'     => $category,
            ':User'         => $name,
        ]
    );
} catch (Exception $e) {
    throw new Exception('Insert failed');
    return;
}

$query->closeCursor();
$PDO = null;
