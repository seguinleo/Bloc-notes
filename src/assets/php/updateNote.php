<?php
session_name('__Secure-notes');
session_start();
if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note'] || isset($_SESSION["nom"], $_SESSION['userId'], $_POST['title'], $_POST['filterDesc']) === false) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/functions.php';
$key = $_SESSION['key'];
$descriptionConnect = $_POST['filterDesc'];
$descriptionConnect = encrypt_data($descriptionConnect, $key);
$noteId = $_POST['noteId'];
$titleConnect = $_POST['title'];
$titleConnect = encrypt_data($titleConnect, $key);
$couleurConnect = $_POST['couleur'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$nom = $_SESSION["nom"];
$couleursAutorisees = ["Noir", "Blanc", "Rouge", "Orange", "Jaune", "Vert", "Cyan", "BleuCiel", "Bleu", "Violet", "Rose"];
if (in_array($couleurConnect, $couleursAutorisees) === false) {
    $couleurConnect = "Noir";
}
$query = $PDO->prepare("UPDATE notes SET titre=:Title,content=:FilterDesc,dateNote=:DateNote,couleur=:Couleur,hiddenNote=:HiddenNote WHERE id=:NoteId AND user=:CurrentUser");
$query->execute(
    [
        ':Title'        => $titleConnect,
        ':FilterDesc'   => $descriptionConnect,
        ':Couleur'      => $couleurConnect,
        ':NoteId'       => $noteId,
        ':DateNote'     => $dateNote,
        ':CurrentUser'  => $nom,
        ':HiddenNote'   => $hidden
    ]
);
$query->closeCursor();
$PDO = null;
