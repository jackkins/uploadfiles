<?php session_start(); ?>
<?php


include_once("config.php");
include_once("controller/maincontroller.controller.php");
$mc = new MainController();
$mc->route();
?>
