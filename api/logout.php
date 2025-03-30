<?php
session_name('secureNotes');
session_start();
if (isset($_SESSION['name']) === false) {
    throw new Exception('Logout failed');
    return;
}
session_unset();
session_destroy();
header('Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"');
