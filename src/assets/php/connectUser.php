<?php
session_name('__Secure-notes');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['csrf_token_connect'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
if ($_POST['csrf_token_connect'] !== $_SESSION['csrf_token_connect']) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
if (!isset($_POST['nomConnect'], $_POST['mdpConnect'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
if (isset($_SESSION["nom"])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config/config.php';
$nomConnect = $_POST['nomConnect'];
$mdpConnect = $_POST['mdpConnect'];
$query = $PDO->prepare("SELECT id,nom,mdp,tri,one_key FROM users WHERE nom=:NomConnect LIMIT 1");
$query->execute([':NomConnect' => $nomConnect]);
$row = $query->fetch(PDO::FETCH_ASSOC);

if (!$row || !password_verify($mdpConnect, $row['mdp'])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}

session_unset();
session_destroy();
session_name('__Secure-notes');
session_set_cookie_params(array(
    'path'      => '/projets/notes/',
    'lifetime'  => 604800,
    'secure'    => true,
    'httponly'  => true,
    'samesite'  => 'Lax'
));
session_start();

$_SESSION['nom'] = $row['nom'];
$_SESSION['userId'] = $row['id'];
$_SESSION['tri'] = $row['tri'];
$_SESSION['key'] = $row['one_key'];

$query->closeCursor();
$PDO = null;
