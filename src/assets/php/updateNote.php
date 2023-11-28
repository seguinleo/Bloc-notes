<?php
session_name('__Secure-notes');
session_start();

if (isset($_POST['csrf_token_note']) === false) {
    http_response_code(403);
    return;
}
if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note']) {
    http_response_code(403);
    return;
}
if (isset($_SESSION['nom'], $_POST['noteId'], $_POST['title'], $_POST['desc'], $_POST['date'], $_POST['couleur'], $_POST['hidden'], $_POST['link']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[0-9]+$/', $_SESSION['noteId']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-z0-9]+$/', $_POST['noteLink']) === false) {
    http_response_code(403);
    return;
}
if ($_POST['link'] !== '' && $_POST['hidden'] === '1') {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

$desc = $_POST['desc'];
$descEncrypted = $encryption->encryptData($desc, $key);
$title = $_POST['title'];
$titleEncrypted = $encryption->encryptData($title, $key);
$couleur = $_POST['couleur'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$nom = $_SESSION['nom'];
$noteId = $_POST['noteId'];
$link = $_POST['link'];
$couleursAutorisees = [
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

if (in_array($couleur, $couleursAutorisees) === false) {
    $couleur = 'Noir';
}

try {
    $query = $PDO->prepare("UPDATE notes SET titre=:Title,content=:Descr,dateNote=:DateNote,couleur=:Couleur,hiddenNote=:HiddenNote WHERE id=:NoteId AND user=:User");
    $query->execute(
        [
            ':Title'      => $titleEncrypted,
            ':Descr'      => $descEncrypted,
            ':Couleur'    => $couleur,
            ':NoteId'     => $noteId,
            ':DateNote'   => $dateNote,
            ':User'       => $nom,
            ':HiddenNote' => $hidden
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
