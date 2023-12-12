<?php
require_once __DIR__ . '/getKey.php';

$sort = $_POST['sort'];

if ($sort === "1") {
    $orderBy = 'ORDER BY id DESC';
} elseif ($sort === "2") {
    $orderBy = 'ORDER BY id';
} elseif ($sort === "3") {
    $orderBy = 'ORDER BY dateNote DESC, id DESC';
} elseif ($sort === "4") {
    $orderBy = 'ORDER BY dateNote, id DESC';
} else {
    http_response_code(403);
    return;
}

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("SELECT id,title,content,color,dateNote,hiddenNote,category,link FROM notes WHERE user=:CurrentUser $orderBy");
    $query->execute([':CurrentUser' => $name]);
    $items = [];

    while ($row = $query->fetch()) {
        $items[] = [
            'id'        => $row['id'],
            'title'     => $encryption->decryptData($row['title'], $key),
            'content'   => $encryption->decryptData($row['content'], $key),
            'color'     => $row['color'],
            'date'      => $row['dateNote'],
            'hidden'    => $row['hiddenNote'],
            'category'  => $row['category'],
            'link'      => $row['link'] === null ? '' : $row['link']
        ];
    }
} catch (Exception $e) {
    http_response_code(500);
    return;
}

echo json_encode($items);
$query->closeCursor();
$PDO = null;
