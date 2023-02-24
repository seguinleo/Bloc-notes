<?php
session_name('__Secure-PHPSESSID');
session_start();
session_unset();
session_destroy();
header('location: ../../');
