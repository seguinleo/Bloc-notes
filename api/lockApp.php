<?php
session_name('secureNotes');
session_start();

$lockApp = filter_input(INPUT_POST, 'lock_app', FILTER_VALIDATE_BOOLEAN);
$_SESSION['lockApp'] = $lockApp;
