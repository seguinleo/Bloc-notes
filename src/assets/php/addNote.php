<?php
if (isset($_POST['title'], $_POST['content'], $_POST['color'], $_POST['hidden']) === false) {
    throw new Exception('Insert failed');
    return;
}

global $PDO, $name, $key;
require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();
$id = bin2hex(random_bytes(12));
$title = $_POST['title'];
$content = $_POST['content'];
$color = $_POST['color'];
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
    $query = $PDO->prepare("INSERT INTO notes (id,title,content,dateNote,color,hiddenNote,category,user) VALUES (:Id,:Title,:Content,:DateNote,:Color,:HiddenNote,:Category,:User)");
    $query->execute(
        [
            ':Id'         => $id,
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
    throw new Exception('Insert failed');
    return;
}

$query->closeCursor();
$PDO = null;
