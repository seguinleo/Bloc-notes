<?php
session_name('secureNotes');
session_start();

$lockApp = filter_var($_SESSION['lockApp'], FILTER_VALIDATE_BOOLEAN);

header('Content-Type: application/json');
print_r(json_encode(['lockApp' => $lockApp]));
