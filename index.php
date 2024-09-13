<?php session_start();

include_once("includes/db.php");
include_once("includes/time.php");
$db = dbConnect();

// create clipboard
if (isset($_GET["c"]) && strlen(htmlspecialchars($_GET["c"])) < 1800) {

}

// paste clipboard
if (isset($_GET["p"]) && strlen(htmlspecialchars($_GET["p"])) <= 10 && strlen(htmlspecialchars($_GET["p"])) >= 4) {

}

// delete clipboard
if (isset($_GET["d"]) && strlen(htmlspecialchars($_GET["d"])) <= 10 && strlen(htmlspecialchars($_GET["d"])) >= 4) {

}