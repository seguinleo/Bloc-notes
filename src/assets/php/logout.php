<?php
session_name('__Secure-notes');
session_start();
session_unset();
session_destroy();
