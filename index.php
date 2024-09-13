<?php session_start();

include_once("includes/db.php");
include_once("includes/utils.php");
$db = dbConnect();

// create clipboard
if (isset($_GET["c"]) && strlen(htmlspecialchars($_GET["c"])) < 1800) {
    $codeGen = false;
    $codeVal = "";
    while (!$codeGen) {
        $codeVal = generateRandomString();

        $cpoiStatement = $db->prepare('SELECT ID FROM cpoi WHERE code = :code');
        $cpoiStatement->execute([
            'code' => $codeVal
        ]);

        $codes = $cpoiStatement->fetchAll();
        if (sizeof($codes) == 0)
            $codeGen = true;
    }

    $sqlQuery = 'INSERT INTO cpoi(code, value) VALUES (:code, :value)';

    $insertCPoi = $db->prepare($sqlQuery);
    $insertCPoi->execute([
        'value' => htmlspecialchars($_GET["c"]),
        'code' => $codeVal
    ]);
    echo $codeVal;
    exit;
}

// paste clipboard
if (isset($_GET["p"]) && strlen(htmlspecialchars($_GET["p"])) <= 10 && strlen(htmlspecialchars($_GET["p"])) >= 4) {
}

// delete clipboard
if (isset($_GET["d"]) && strlen(htmlspecialchars($_GET["d"])) <= 10 && strlen(htmlspecialchars($_GET["d"])) >= 4) {
}
