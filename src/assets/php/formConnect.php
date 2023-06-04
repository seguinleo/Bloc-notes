<?php
session_start();
if ($_POST['csrf_token_connect'] !== $_SESSION['csrf_token_connect'] || !isset($_POST['nomConnect'], $_POST['mdpConnect']) || isset($_SESSION["nom"], $_SESSION['userId'])) {
    exit();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/projets/notes/assets/php/config.php';
$nomConnect = $_POST['nomConnect'];
$mdpConnect = $_POST['mdpConnect'];
$query = $PDO->prepare("SELECT * FROM users WHERE nom=:NomConnect");
$query->execute([':NomConnect' => $nomConnect]);
$row = $query->fetch(PDO::FETCH_ASSOC);
if (!password_verify($mdpConnect, $row['mdp'])) {
    echo json_encode(['success' => false]);
    exit();
}
$_SESSION['nom'] = $row['nom'];
$_SESSION['userId'] = $row['id'];
$_SESSION['tri'] = $row['tri'];
$_SESSION['key'] = $row['one_key'];
echo json_encode(['success' => true]);
$query->closeCursor();
$PDO = null;
