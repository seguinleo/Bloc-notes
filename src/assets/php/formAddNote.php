<?php
session_name('__Secure-notes');
session_start();
if ($_POST['csrf_token_note'] !== $_SESSION['csrf_token_note'] || isset($_SESSION["nom"], $_SESSION['userId'], $_POST['titleConnect'], $_POST['descriptionConnect']) === false) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/functions.php';
$descriptionConnect = $_POST['descriptionConnect'];
$key = $_SESSION['key'];
$descriptionConnect = encrypt_data($descriptionConnect, $key);
$titleConnect = $_POST['titleConnect'];
$titleConnect = encrypt_data($titleConnect, $key);
$couleurConnect = $_POST['couleurConnect'];
$dateNote = $_POST['date'];
$hidden = $_POST['hidden'];
$nom = $_SESSION["nom"];
$couleursAutorisees = ["Noir", "Blanc", "Rouge", "Orange", "Jaune", "Vert", "Cyan", "BleuCiel", "Bleu", "Violet", "Rose"];
if (in_array($couleurConnect, $couleursAutorisees) === false) {
    $couleurConnect = "Noir";
}
$query = $PDO->prepare("INSERT INTO notes (titre,content,dateNote,couleur,user,hiddenNote) VALUES (:TitleConnect,:DescriptionConnect,:DateNote,:CouleurConnect,:CurrentUser,:HiddenNote)");
$query->execute(
    [
        ':TitleConnect'         => $titleConnect,
        ':DescriptionConnect'   => $descriptionConnect,
        ':DateNote'             => $dateNote,
        ':CouleurConnect'       => $couleurConnect,
        ':CurrentUser'          => $nom,
        ':HiddenNote'           => $hidden
    ]
);
$query->closeCursor();
$PDO = null;
