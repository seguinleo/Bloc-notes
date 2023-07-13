<?php
session_name('__Secure-notes');
session_start();

if (isset($_POST['csrf_token_mdp']) === false) {
    http_response_code(403);
}
if ($_POST['csrf_token_mdp'] !== $_SESSION['csrf_token_mdp']) {
    http_response_code(403);
}
if (isset($_SESSION["nom"], $_SESSION["userId"], $_POST['mdpNew']) === false) {
    http_response_code(403);
}

require_once __DIR__ . '/config/config.php';

$nom = $_SESSION["nom"];
$userId = $_SESSION["userId"];
$mdpNew = $_POST['mdpNew'];
$mdpNewSecure = password_hash($mdpNew, PASSWORD_DEFAULT);
$query = $PDO->prepare("UPDATE users SET mdp=:MdpHash WHERE nom=:CurrentUser AND id=:UserId");
$query->execute(
    [
        ':MdpHash'      => $mdpNewSecure,
        ':CurrentUser'  => $nom,
        ':UserId'       => $userId
    ]
);
$query->closeCursor();
$PDO = null;
