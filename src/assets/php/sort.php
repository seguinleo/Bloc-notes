<?php
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"]) || !isset($_SESSION['userId'])) {
  header('HTTP/2.0 403 Forbidden');
  exit();
} else {
  $tri = htmlspecialchars($_POST['tri'], ENT_QUOTES);
  if ($tri == "Titre" || $tri == "Date de création" || $tri == "Date de modification") {
    $query = $PDO->prepare("UPDATE users SET tri=:Tri WHERE nom=:CurrentUser AND id=:UserId");
    $query->execute([
      ':Tri' => $tri,
      ':CurrentUser' => $_SESSION["nom"],
      ':UserId' => $_SESSION["userId"]
    ]);
    $query->closeCursor();
    $_SESSION['tri'] = $tri;
  }
  $PDO = null;
}
