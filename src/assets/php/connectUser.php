<?php
session_name('__Secure-notes');
session_start();

if (isset($_POST['csrf_token_connect']) === false) {
    http_response_code(403);
    return;
}
if ($_POST['csrf_token_connect'] !== $_SESSION['csrf_token_connect']) {
    http_response_code(403);
    return;
}
if (isset($_POST['nomConnect'], $_POST['mdpConnect']) === false) {
    http_response_code(403);
    return;
}
if (isset($_SESSION['nom']) === true) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nomConnect = $_POST['nomConnect'];
$mdpConnect = $_POST['mdpConnect'];

try {
    $query = $PDO->prepare("SELECT id,nom,mdp,tri FROM users WHERE nom=:NomConnect LIMIT 1");
    $query->execute([':NomConnect' => $nomConnect]);
    $row = $query->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;

if (!$row || !password_verify($mdpConnect, $row['mdp'])) {
    http_response_code(403);
    return;
}

session_unset();
session_destroy();
session_name('__Secure-notes');
$cookieParams = [
    'path'     => './',
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($cookieParams);
session_start();

$_SESSION['nom'] = $row['nom'];
$_SESSION['userId'] = $row['id'];
$_SESSION['tri'] = $row['tri'];
