<?php
session_name('__Secure-notes');
session_start();

if (isset($_POST['csrf_token_creer']) === false) {
    http_response_code(403);
    return;
}
if ($_POST['csrf_token_creer'] !== $_SESSION['csrf_token_creer']) {
    http_response_code(403);
    return;
}
if (isset($_POST['nomCreer'], $_POST['mdpCreer']) === false) {
    http_response_code(403);
    return;
}
if (isset($_SESSION["nom"]) === true) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nomCreer = $_POST['nomCreer'];
$mdpCreer = $_POST['mdpCreer'];
$mdpCreerSecure = password_hash($mdpCreer, PASSWORD_DEFAULT);
$key = openssl_random_pseudo_bytes(32);
$query = $PDO->prepare("INSERT INTO users (nom,mdp,one_key) VALUES (:NomCreer,:MdpHash,:OneKey)");
$query->execute(
    [
        ':NomCreer' => $nomCreer,
        ':MdpHash'  => $mdpCreerSecure,
        ':OneKey'   => htmlspecialchars($key)
    ]
);
$query->closeCursor();
$PDO = null;
