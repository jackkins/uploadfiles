<?php

#File configuration
define("DIR", __DIR__);
define("PREFOLDER","/files");
#Database

define("DB_NAME", "files");
define("DB_HOST", "localhost");
define("DB_USER_NAME", "root");
define("DB_USER_PASSWORD", "");

#Mail
define("MAIN_EMAIL", "localhost");


// Bytes
$max_upload_file = 104857600000; // 10 MB
$allowTypes = array(); // array() - all types
$max_count_files = 10; // 0 - unlimited

define("max_upload_file", $max_upload_file);
define("allowTypes", json_encode($allowTypes));
define("max_count_files", $max_count_files);