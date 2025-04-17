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

if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $name) === false) {
    throw new Exception('Connection failed');
    return;
}

if ($name) {
    global $PDO;
    require_once __DIR__ . '/config/config.php';

    try {
        $query = $PDO->prepare("SELECT name FROM users WHERE name=:NameConnect LIMIT 1");
        $query->execute([':NameConnect' => $name]);
        $row = $query->fetch();
        if (!$row || $query->rowCount() !== 1) {
            $name = false;
        }
    } catch (Exception $e) {
        throw new Exception('Connection failed');
        return;
    }
}

header('Content-Type: application/json');
print_r(json_encode(['name' => $name]));
