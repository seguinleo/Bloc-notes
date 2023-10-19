<?php
session_name('__Secure-notes');
session_start();

if (isset($_SESSION['nom'], $_SESSION['userId'], $_SESSION['tri']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[a-zA-ZÀ-ÿ -]+$/', $_SESSION['nom']) === false) {
    http_response_code(403);
    return;
}
if (preg_match('/^[0-9]+$/', $_SESSION['userId']) === false) {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/config/config.php';

if ($PDO === null) {
    http_response_code(500);
    return;
}

$nom = $_SESSION['nom'];
$userId = $_SESSION['userId'];
$tri = $_SESSION['tri'];

try {
    $query = $PDO->prepare("SELECT one_key FROM users WHERE nom=:CurrentUser AND id=:UserId LIMIT 1");
    $query->execute(
        [
            ':CurrentUser' => $nom,
            ':UserId'      => $userId
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    return;
}

$key = $query->fetch(PDO::FETCH_ASSOC)['one_key'];
$query->closeCursor();
