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
if (isset($_SESSION['nom'], $_POST['title'], $_POST['desc'], $_POST['date'], $_POST['couleur'], $_POST['hidden']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

$title = $_POST['title'];
$desc = $_POST['desc'];
$couleur = $_POST['couleur'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
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
    $query = $PDO->prepare("INSERT INTO notes (titre,content,dateNote,couleur,user,hiddenNote) VALUES (:Titre,:Content,:DateNote,:Couleur,:User,:HiddenNote)");
    $query->execute(
        [
            ':Titre'        => $encryption->encryptData($title, $key),
            ':Content'      => $encryption->encryptData($desc, $key),
            ':DateNote'     => $dateNote,
            ':Couleur'      => $couleur,
            ':User'         => $nom,
            ':HiddenNote'   => $hidden
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;
