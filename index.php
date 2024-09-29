<?php session_start();

// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

include_once("includes/db.php");
include_once("includes/utils.php");
$db = dbConnect();

function checkValidCodeSilent(string $str): bool
{
    $val = strlen($str) <= 20 && strlen($str) >= 5;
    return $val;
}

function checkValidCode(string $str): bool
{
    $val = checkValidCodeSilent($str);
    if (!$val) echo "CPOI ERROR: Code is not in a valid format";
    return $val;
}

function checkValidValue(string $str): bool
{
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $val = strlen($str) <= 1800;
        if (!$val) echo "CPOI ERROR [GET]: Value is not in a valid format (max length = 1800)";
        return $val;
    } else {
        $val = strlen($str) <= 60000;
        if (!$val) echo "CPOI ERROR [POST]: Value is not in a valid format (max length = 60000)";
        return $val;
    }
}


function passiveClean(): void
{
    global $db;

    // delete normal
    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE type=:type AND date < DATE_SUB(NOW(), INTERVAL 30 DAY_MINUTE)');
    $cpoiStatement->execute(['type' => '']);
    // delete unique
    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE type=:type AND date < DATE_SUB(NOW(), INTERVAL 30 DAY_MINUTE)');
    $cpoiStatement->execute(['type' => 'u']);
    // delete short life
    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE type=:type AND date < DATE_SUB(NOW(), INTERVAL 5 DAY_MINUTE)');
    $cpoiStatement->execute(['type' => 's']);
    // delete long life
    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE type=:type AND date < DATE_SUB(NOW(), INTERVAL 12 DAY_HOUR)');
    $cpoiStatement->execute(['type' => 'l']);
    // delete anything that would still be in the table
    $cpoiStatement = $db->prepare('DELETE FROM cpoi WHERE date < DATE_SUB(NOW(), INTERVAL 24 DAY_HOUR)');
    $cpoiStatement->execute();
}

passiveClean();

// CREATE CLIPBOARD \\

function createClipboard(string $content, string $type = ""): void
{
    global $db;

    if (isset($_REQUEST["t"]) && $type == "") {
        if (htmlspecialchars($_REQUEST["t"]) == "u")
            $type = "u";
        if (htmlspecialchars($_REQUEST["t"]) == "l")
            $type = "l";
        if (htmlspecialchars($_REQUEST["t"]) == "s")
            $type = "s";
    }

    $moreinfo = "";
    if (isset($_REQUEST["m"]) && strlen(htmlspecialchars($_REQUEST["m"])) < 500) {
        $moreinfo = htmlspecialchars($_REQUEST["m"]);
    }

    $codeGen = false;
    $codeVal = "";
    while (!$codeGen) {
        if (isset($_REQUEST["l"]) && htmlspecialchars($_REQUEST["l"]) == "fr")
            $lines = file("data/frWords");
        else
            $lines = file("data/enWords");
        $word1 = $lines[array_rand($lines)];
        $word2 = $lines[array_rand($lines)];
        $word3 = $lines[array_rand($lines)];
        $codeVal = substr($word1, 0, strlen($word1) - 1) . "-" . substr($word2, 0, strlen($word2) - 1) . "-" . substr($word3, 0, strlen($word3) - 1);

        $cpoiStatement = $db->prepare('SELECT ID FROM cpoi WHERE code = :code');
        $cpoiStatement->execute([
            'code' => $codeVal
        ]);

        $codes = $cpoiStatement->fetchAll();
        if (sizeof($codes) == 0)
            $codeGen = true;
    }

    $sqlQuery = 'INSERT INTO cpoi(info, type, code, value) VALUES (:info, :type, :code, :value)';

    $insertCPoi = $db->prepare($sqlQuery);
    $insertCPoi->execute([
        'info' => $moreinfo,
        'type' => $type,
        'value' => $content,
        'code' => $codeVal
    ]);
    echo $codeVal;
    exit;
}

// create normal clipboard
if (isset($_REQUEST["c"]) && checkValidValue(htmlspecialchars($_REQUEST["c"]))) {
    createClipboard(htmlspecialchars($_REQUEST["c"]));
}

// create unique normal clipboard
if (isset($_REQUEST["uc"]) && checkValidValue(htmlspecialchars($_REQUEST["uc"]))) {
    createClipboard(htmlspecialchars($_REQUEST["uc"]), "u");
}

// aggregate clipboard
if (isset($_REQUEST["a"]) && checkValidValue(htmlspecialchars($_REQUEST["a"]))) {
    $split = explode(':', htmlspecialchars($_REQUEST["a"]), 2);
    $code = $split[0];
    $agg = $split[1];

    $cpoiStatement = $db->prepare('SELECT * FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => htmlspecialchars($code)
    ]);

    $codes = $cpoiStatement->fetchAll();
    if (sizeof($codes) == 0) {
        echo "CPOI ERROR: " . htmlspecialchars($code) . " is not a valid clipboard!";
        exit;
    }

    if (strpos($codes[0]["info"], "const") !== false) {
        echo "CPOI ERROR: " . htmlspecialchars($code) . " is not editable!";
        exit;
    }
    $sqlQuery = 'UPDATE cpoi SET date = current_timestamp(), value = :value WHERE code = :code';

    $newValue = $codes[0]["value"] . $agg;

    if (strlen($newValue) > 60000) {
        echo "CPOI ERROR: Clipboard can not be longer than 60000 chars. " . htmlspecialchars($code) . " has not been updated.";
        exit;
    }
    $updateCpoi = $db->prepare($sqlQuery);
    $updateCpoi->execute([
        'code' => $code,
        'value' => $newValue
    ]);
    echo $updateCpoi->rowCount();
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
if (isset($_REQUEST["d"]) && checkValidCode(htmlspecialchars($_REQUEST["d"]))) {
    $cpoiStatement = $db->prepare('SELECT ID FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => htmlspecialchars($_REQUEST["d"])
    ]);

    $codes = $cpoiStatement->fetchAll();
    if (sizeof($codes) == 0)
        echo "CPOI ERROR: " . htmlspecialchars($_REQUEST["d"]) . " is not a valid clipboard!";
    else {
        echo "Ok.";
        deleteClipboard(htmlspecialchars($_REQUEST["d"]));
    }
}


// PASTE CLIPBOARD \\

function pasting(string $input): int
{
    global $db;
    $cpoiStatement = $db->prepare('SELECT * FROM cpoi WHERE code = :code');
    $cpoiStatement->execute([
        'code' => $input
    ]);

    $codes = $cpoiStatement->fetchAll();
    if (sizeof($codes) == 0) {
        return 1;
    } else {
        if ($codes[0]["type"] == "u") {
            deleteClipboard($input);
        }

        echo $codes[0]["value"];
        return 0;
    }
}

if (isset($_REQUEST["p"]) && checkValidCode(htmlspecialchars($_REQUEST["p"]))) {
    if (pasting(htmlspecialchars($_REQUEST["p"])) == 1)
        echo "CPOI ERROR: " . htmlspecialchars($_REQUEST["p"]) . " is not a valid clipboard!";
}


// AUTOMATIC CLIPBOARD \\

// create or paste easy clipboard
if (isset($_REQUEST["e"]) && checkValidValue(htmlspecialchars($_REQUEST["e"]))) {
    if (checkValidCodeSilent(htmlspecialchars($_REQUEST["e"]))) {
        if (pasting(htmlspecialchars($_REQUEST["e"])) == 1)
            createClipboard(htmlspecialchars($_REQUEST["e"]));
    } else
        createClipboard(htmlspecialchars($_REQUEST["e"]));
}

// POST ANSWERS \\

// basic pong
if (isset($_REQUEST["ping"])) {
    echo "pong!";
}
