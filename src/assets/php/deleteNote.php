<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  header('HTTP/2.0 403 Forbidden');
} else {
  require_once "config.php";
  $noteId = htmlspecialchars($_POST['noteId'], ENT_QUOTES);
  if ($noteId) {
    $query = $PDO->prepare("DELETE FROM `TABLE_NAME` WHERE id=:NoteId AND user=:CurrentUser");
    $query->execute([':NoteId' => $noteId, ':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)]);
    $query->closeCursor();
  }
  $PDO = null;
}
