<?php
global $PDO, $name, $key;
require_once __DIR__ . '/getKey.php';
require_once __DIR__ . '/class/Encryption.php';

$encryption = new Encryption\Encryption();

try {
    $query = $PDO->prepare("SELECT id,title,content,color,dateNote,hiddenNote,category,folder,pinnedNote,link FROM notes WHERE user=:CurrentUser");
    $query->execute([':CurrentUser' => $name]);
    $notes = [];

    while ($row = $query->fetch()) {
        $notes[] = [
            'id'        => $row['id'],
            'title'     => $encryption->decryptData($row['title'], $key),
            'content'   => $encryption->decryptData($row['content'], $key),
            'color'     => $row['color'],
            'date'      => $row['dateNote'],
            'category'  => filter_var($row['category'], FILTER_VALIDATE_INT),
            'hidden'    => filter_var($row['hiddenNote'], FILTER_VALIDATE_INT),
            'pinned'    => filter_var($row['pinnedNote'], FILTER_VALIDATE_INT),
            'link'      => $row['link'] ?? null,
            'folder'    => $row['folder'] ?? null
        ];
    }
} catch (Exception $e) {
    throw new Exception('Note retrieval failed');
    return;
}

$query->closeCursor();
$PDO = null;

header('Content-Type: application/json');
print_r(json_encode($notes));
