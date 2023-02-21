<?php
session_name('__Secure-PHPSESSID');
session_start();
if(isset($_SESSION["nom"])) {
    header('HTTP/2.0 403 Forbidden');
} else {
    require_once "config.php";
    $nomConnect = htmlspecialchars($_POST['nomConnect'], ENT_QUOTES);
    $mdpConnect = htmlspecialchars($_POST['mdpConnect'], ENT_QUOTES);
    if ($nomConnect && $mdpConnect) {
        $query = $PDO->prepare("SELECT * FROM `TABLE_NAME` WHERE nom=:NomConnect");
        $query->execute([':NomConnect' => $nomConnect]);
        $row = $query->fetch(PDO::FETCH_ASSOC);
        if (password_verify($mdpConnect, $row['mdp'])) {
            $_SESSION['nom'] = $nomConnect;
        } else {
            header('HTTP/2.0 500 Internal Server');
        }
        $query->closeCursor();
    } else {
        header('HTTP/2.0 400 Bad Request');
    }
    $PDO = null;
}