<?php
session_name('__Secure-notes');
session_start();

if (isset($_POST['csrf_token_note']) === false) {
    http_response_code(403);
}
if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note']) {
    http_response_code(403);
}
if (isset($_SESSION["nom"], $_SESSION['key'], $_SESSION['userId'], $_POST['noteId'], $_POST['title'], $_POST['desc'], $_POST['date'], $_POST['couleur'], $_POST['hidden']) === false) {
    http_response_code(403);
}

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

$key = $_SESSION['key'];
$desc = $_POST['desc'];
$desc = $encryption->encryptData($desc, $key);
$title = $_POST['title'];
$title = $encryption->encryptData($title, $key);
$couleur = $_POST['couleur'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$nom = $_SESSION["nom"];
$noteId = $_POST['noteId'];
$couleursAutorisees = [
    "Noir",
    "Blanc",
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
    $couleur = "Noir";
}

$query = $PDO->prepare("UPDATE notes SET titre=:Title,content=:Descr,dateNote=:DateNote,couleur=:Couleur,hiddenNote=:HiddenNote WHERE id=:NoteId AND user=:User");
$query->execute(
    [
        ':Title'     => $title,
        ':Descr'     => $desc,
        ':Couleur'   => $couleur,
        ':NoteId'    => $noteId,
        ':DateNote'  => $dateNote,
        ':User'      => $nom,
        ':HiddenNote'=> $hidden
    ]
);
$query->closeCursor();
$PDO = null;
