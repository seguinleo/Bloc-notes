<?php
session_name('secureNotes');
$cookieParams = [
    'path'     => '/',
    'lifetime' => 604800,
    'secure'   => false,
    'httponly' => true,
    'samesite' => 'Lax',
];
session_set_cookie_params($cookieParams);
session_start();
session_regenerate_id();

$name = $_SESSION['name'] ?? null;

if (isset($name) === true) {
    $csrf_token = $_SESSION['csrf_token'];
} else {
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $csrf_token;
}
