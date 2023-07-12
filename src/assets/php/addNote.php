<?php
session_name('__Secure-notes');
session_start();

if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note']) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_POST['title'], $_POST['desc'], $_POST['date'], $_POST['couleur'], $_POST['hidden'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/class/Encryption.php';

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
$couleursAutorisees = ["Noir", "Blanc", "Rouge", "Orange", "Jaune", "Vert", "Cyan", "BleuCiel", "Bleu", "Violet", "Rose"];

if (in_array($couleur, $couleursAutorisees) === false) {
    $couleur = "Noir";
}

$query = $PDO->prepare("INSERT INTO notes (titre,content,dateNote,couleur,user,hiddenNote) VALUES (:Title,:Descr,:DateNote,:Couleur,:CurrentUser,:HiddenNote)");
$query->execute(
    [
        ':Title'        => $title,
        ':Descr'        => $desc,
        ':DateNote'     => $dateNote,
        ':Couleur'      => $couleur,
        ':CurrentUser'  => $nom,
        ':HiddenNote'   => $hidden
    ]
);
$query->closeCursor();
$PDO = null;
