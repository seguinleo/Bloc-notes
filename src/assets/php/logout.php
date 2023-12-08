<?php
session_name('__Secure-notes');
session_start();
if (isset($_SESSION['name']) === false) {
    http_response_code(403);
    return;
}
session_unset();
session_destroy();
