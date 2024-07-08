<?php
session_name('secureNotes');
session_start();

if (filter_input(INPUT_POST, 'csrf_token', FILTER_DEFAULT) !== $_SESSION['csrf_token']) {
  throw new Exception('Connection timeout, please reload the page');
  return;
}

$lockApp = filter_input(INPUT_POST, 'lock_app', FILTER_VALIDATE_BOOLEAN);

$_SESSION['lockApp'] = $lockApp;
