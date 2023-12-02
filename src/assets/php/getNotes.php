<?php
require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();
$sort = $_POST['sort'];

if ($sort === "1") {
    $orderBy = 'ORDER BY id DESC';
} else if ($sort === "2") {
    $orderBy = 'ORDER BY id';
} else if ($sort === "4") {
    $orderBy = 'ORDER BY dateNote, id DESC';
} else {
    $orderBy = 'ORDER BY dateNote DESC, id DESC';
}

try {
    $query = $PDO->prepare("SELECT id,titre,couleur,content,dateNote,hiddenNote,link FROM notes WHERE user=:CurrentUser $orderBy");
    $query->execute([':CurrentUser' => $nom]);
    $items = [];

    while ($row = $query->fetch()) {
        $items[] = [
            'id'      => $row['id'],
            'title'   => $encryption->decryptData($row['titre'], $key),
            'couleur' => $row['couleur'],
            'desc'    => $encryption->decryptData($row['content'], $key),
            'date'    => $row['dateNote'],
            'hidden'  => $row['hiddenNote'],
            'link'    => $row['link'] === null ? '' : $row['link']
        ];
    }
} catch (Exception $e) {
    http_response_code(500);
    return;
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
