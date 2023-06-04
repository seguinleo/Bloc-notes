<?php
session_name('__Secure-notes');
session_start();
if ($_POST['csrf_token_creer'] !== $_SESSION['csrf_token_creer'] || isset($_POST['nomCreer'], $_POST['mdpCreer']) === false || isset($_SESSION["nom"], $_SESSION['userId'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$nomCreer = $_POST['nomCreer'];
$mdpCreer = $_POST['mdpCreer'];
$mdpCreerSecure = password_hash($mdpCreer, PASSWORD_DEFAULT);
$key = openssl_random_pseudo_bytes(32);
$query = $PDO->prepare("INSERT INTO users (nom,mdp,one_key) VALUES (:NomCreer,:MdpHash,:OneKey)");
$query->execute(
    [
        ':NomCreer' => $nomCreer,
        ':MdpHash'  => $mdpCreerSecure,
        ':OneKey'   => $key
    ]
);
$query->closeCursor();
$PDO = null;
