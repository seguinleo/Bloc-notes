<?php
require_once __DIR__ . '/getKey.php';

if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note']) {
    http_response_code(403);
    return;
}
if (isset($_SESSION['name'], $_POST['title'], $_POST['content'], $_POST['date'], $_POST['color'], $_POST['hidden']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

$title = $_POST['title'];
$content = $_POST['content'];
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
    $query = $PDO->prepare("INSERT INTO notes (title,content,dateNote,color,hiddenNote,user) VALUES (:Title,:Content,:DateNote,:Color,:HiddenNote,:User)");
    $query->execute(
        [
            ':Title'      => $encryption->encryptData($title, $key),
            ':Content'    => $encryption->encryptData($content, $key),
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
