<?php
global $PDO, $name, $key;
require_once __DIR__ . '/getKey.php';

$sort = filter_input(INPUT_POST, 'sort', FILTER_SANITIZE_NUMBER_INT);

if ($sort === '1') {
    $orderBy = 'ORDER BY pinnedNote DESC, dateNote DESC';
} else {
    $orderBy = 'ORDER BY pinnedNote DESC, dateNote';
}

require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("SELECT id,title,content,color,dateNote,hiddenNote,category,pinnedNote,link FROM notes WHERE user=:CurrentUser $orderBy");
    $query->execute([':CurrentUser' => $name]);
    $notes = [];

    while ($row = $query->fetch()) {
        $notes[] = [
            'id'        => $row['id'],
            'title'     => $encryption->decryptData($row['title'], $key),
            'content'   => $encryption->decryptData($row['content'], $key),
            'color'     => $row['color'],
            'date'      => $row['dateNote'],
            'hidden'    => filter_var($row['hiddenNote'], FILTER_VALIDATE_INT),
            'category'  => filter_var($row['category'], FILTER_VALIDATE_INT),
            'pinned'    => filter_var($row['pinnedNote'], FILTER_VALIDATE_INT),
            'link'      => $row['link'] ?? null
        ];
    }
} catch (Exception $e) {
    throw new Exception('Note retrieval failed');
    return;
}

$query->closeCursor();
$PDO = null;

header('Content-Type: application/json');
echo json_encode($notes);
