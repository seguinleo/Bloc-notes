<?php
$nameConnect = $_POST['nameConnect'];
$psswdConnect = $_POST['psswdConnect'];
if (isset($nameConnect, $psswdConnect) === false) {
    throw new Exception('Connection failed');
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $nameConnect) === false) {
    throw new Exception('Connection failed');
    return;
}
if (strlen($nameConnect) > 25 || strlen($psswdConnect) > 64) {
    throw new Exception('Connection failed');
    return;
}

session_name('__Secure-notes');
session_start();

if (isset($_SESSION['name']) === true) {
    throw new Exception('Connection failed');
    return;
}
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    throw new Exception('Connection failed');
    return;
}

global $PDO;
require_once __DIR__ . '/config/config.php';

try {
    $query = $PDO->prepare("SELECT id,name,psswd FROM users WHERE name=:NameConnect LIMIT 1");
    $query->execute([':NameConnect' => $nameConnect]);
    $row = $query->fetch();
    if (!$row || $query->rowCount() !== 1) {
        throw new Exception('Connection failed');
        return;
    }
} catch (Exception $e) {
    throw new Exception('Connection failed');
    return;
}

$query->closeCursor();
$PDO = null;

if (!password_verify($psswdConnect, $row['psswd'])) {
    throw new Exception('Connection failed');
    return;
}

session_unset();
session_destroy();
session_name('__Secure-notes');
$cookieParams = [
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($cookieParams);
session_start();
session_regenerate_id();
$_SESSION['name'] = $row['name'];
$_SESSION['userId'] = $row['id'];
