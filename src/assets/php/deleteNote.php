<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"], $_SESSION['userId'], $_POST['noteId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
}
require_once "./config.php";
$query = $PDO->prepare("DELETE FROM notes WHERE id=:NoteId AND user=:CurrentUser");
$query->execute([
  ':NoteId' => htmlspecialchars($_POST['noteId'], ENT_QUOTES),
  ':CurrentUser' => htmlspecialchars($_SESSION["nom"], ENT_QUOTES)
]);
$query->closeCursor();
$PDO = null;
