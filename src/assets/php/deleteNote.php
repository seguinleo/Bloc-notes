<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  require_once "./config.php";
  $noteId = htmlspecialchars($_POST['noteId'], ENT_QUOTES);
  if ($noteId) {
    $query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser");
    $query->execute([':NoteId' => $noteId, ':CurrentUser' => $_SESSION["nom"]]);
    $query->closeCursor();
  }
  $PDO = null;
}
