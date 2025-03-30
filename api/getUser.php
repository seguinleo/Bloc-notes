<?php
session_name('secureNotes');
$cookieParams = [
    'path'     => '/',
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax',
];
session_set_cookie_params($cookieParams);
session_start();
session_regenerate_id();

$name = $_SESSION['name'] ?? false;

header('Content-Type: application/json');
print_r(json_encode(['name' => $name]));
