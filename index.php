<?php session_start();

include_once("includes/db.php");
include_once("includes/utils.php");
$db = dbConnect();

function checkValidCode(string $str) : bool {
    return strlen($str) <= 20 && strlen($str) >= 5;
}

function passiveClean(): void
{
    global $db;

    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE date < DATE_SUB(NOW(), INTERVAL 30 DAY_MINUTE)');
    $cpoiStatement->execute();
}

passiveClean();

// CREATE CLIPBOARD \\

function createClipboard(string $content, string $type = ""): void
{
    global $db;

    $codeGen = false;
    $codeVal = "";
    while (!$codeGen) {
        $lines = file("data/codewords");
        $word1=$lines[array_rand($lines)];
        $word2=$lines[array_rand($lines)];
        $word3=$lines[array_rand($lines)];
        $codeVal = substr($word1, 0, strlen($word1)-1) . "-" . substr($word2, 0, strlen($word2)-1) . "-" . substr($word3, 0, strlen($word3)-1);

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

    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => $code
    ]);
}

// manually delete clipboard
if (isset($_GET["d"]) && checkValidCode(htmlspecialchars($_GET["d"]))) {
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

if (isset($_GET["p"]) && checkValidCode(htmlspecialchars($_GET["p"]))) {
    $cpoiStatement = $db->prepare('SELECT * FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => htmlspecialchars($_GET["p"])
    ]);

    $codes = $cpoiStatement->fetchAll();
    if (sizeof($codes) == 0)
        echo "CPOI ERROR: " . htmlspecialchars($_GET["p"]) . " is not a valid clipboard!";
    else {
        if ($codes[0]["type"] == "u") {
            deleteClipboard(htmlspecialchars($_GET["p"]));
        }

        echo $codes[0]["value"];
    }
}
