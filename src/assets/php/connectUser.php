<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name']) === true) {
    http_response_code(403);
    return;
}
if ($_POST['csrf_token_connect'] !== $_SESSION['csrf_token_connect']) {
    http_response_code(403);
    return;
}
if (isset($_POST['nameConnect'], $_POST['psswdConnect']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

$nameConnect = $_POST['nameConnect'];

try {
    $query = $PDO->prepare("SELECT id,name,psswd FROM users WHERE name=:nameConnect LIMIT 1");
    $query->execute([':nameConnect' => $nameConnect]);
    $row = $query->fetch();
    if (!$row) {
        http_response_code(401);
        return;
    }
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$query->closeCursor();
$PDO = null;

$psswdConnect = $_POST['psswdConnect'];

if (!password_verify($psswdConnect, $row['psswd'])) {
    http_response_code(403);
    return;
}

session_unset();
session_destroy();
session_name('__Secure-notes');
$cookieParams = [
    'path'     => '/seguinleo-notes/',
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($cookieParams);
session_start();

$_SESSION['name'] = $row['name'];
$_SESSION['userId'] = $row['id'];
