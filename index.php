<?php session_start();

include_once("includes/db.php");
include_once("includes/utils.php");
$db = dbConnect();


// CREATE CLIPBOARD \\

function createClipboard(string $content, string $type = ""): void
{
    global $db;

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

    $sqlQuery = 'INSERT INTO cpoi(type, code, value) VALUES (:type, :code, :value)';

    $insertCPoi = $db->prepare($sqlQuery);
    $insertCPoi->execute([
        'type' => $type,
        'value' => $content,
        'code' => $codeVal
    ]);
    echo $codeVal;
    exit;
}

// create normal clipboard
if (isset($_GET["c"]) && strlen(htmlspecialchars($_GET["c"])) < 1800) {
    createClipboard(htmlspecialchars($_GET["c"]));
}

// create unique normal clipboard
if (isset($_GET["uc"]) && strlen(htmlspecialchars($_GET["uc"])) < 1800) {
    createClipboard(htmlspecialchars($_GET["uc"]), "u");
}


// DELETE CLIPBOARD \\

function deleteClipboard(string $code): void
{
    global $db;

    if (isset($_GET["d"]) && strlen(htmlspecialchars($_GET["d"])) <= 10 && strlen(htmlspecialchars($_GET["d"])) >= 4) {
        $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE code = :code');
        $cpoiStatement->execute([
            'code' => $code
        ]);
    }
}

// manually delete clipboard
if (isset($_GET["d"]) && strlen(htmlspecialchars($_GET["d"])) <= 10 && strlen(htmlspecialchars($_GET["d"])) >= 4) {
    $cpoiStatement = $db->prepare('SELECT ID FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => htmlspecialchars($_GET["d"])
    ]);

    $codes = $cpoiStatement->fetchAll();
    if (sizeof($codes) == 0)
        echo "CPOI ERROR: " . htmlspecialchars($_GET["d"]) . " is not a valid clipboard!";
    else {
        echo "Ok.";
        deleteClipboard(htmlspecialchars($_GET["d"]));
    }
}


// PASTE CLIPBOARD \\

if (isset($_GET["p"]) && strlen(htmlspecialchars($_GET["p"])) <= 10 && strlen(htmlspecialchars($_GET["p"])) >= 4) {
    $cpoiStatement = $db->prepare('SELECT * FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => htmlspecialchars($_GET["p"])
    ]);

    $codes = $cpoiStatement->fetchAll();
    if (sizeof($codes) == 0)
        echo "CPOI ERROR: " . htmlspecialchars($_GET["p"]) . " is not a valid clipboard!";
    else {
        if ($codes[0]["type"] == "u")
            deleteClipboard(htmlspecialchars($_GET["p"]));
    }
}
