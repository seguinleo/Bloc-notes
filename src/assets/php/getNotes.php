<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
    header('HTTP/2.0 403 Forbidden');
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/functions.php';
$tri = $_SESSION['tri'];
switch ($tri) {
    case "Date de création":
        $orderBy = "ORDER BY id DESC, titre";
        break;
    case "Date de modification":
        $orderBy = "ORDER BY dateNote DESC, id DESC, titre";
        break;
    default:
        $orderBy = "ORDER BY titre";
        break;
}
$query = $PDO->prepare("SELECT id, titre, couleur, content, dateNote, hiddenNote FROM notes WHERE user=:CurrentUser $orderBy");
$query->execute([':CurrentUser' => $_SESSION["nom"]]);
$items = $query->fetchAll(PDO::FETCH_ASSOC);
foreach ($items as &$item) {
    $item['id'] = htmlspecialchars($item['id'], ENT_QUOTES);
    $item['title'] = htmlspecialchars(decrypt_data($item['titre'], $_SESSION['key']), ENT_QUOTES);
    $item['desc'] = htmlspecialchars(decrypt_data($item['content'], $_SESSION['key']), ENT_QUOTES);
    $item['date'] = $item['dateNote'];
    $item['couleur'] = $item['couleur'];
    $item['hidden'] = $item['hiddenNote'];
}
echo json_encode($items);
$query->closeCursor();
$PDO = null;
