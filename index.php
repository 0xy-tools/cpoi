<?php session_start();

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
    $val = strlen($str) <= 1800;
    if (!$val) echo "CPOI ERROR: Value is not in a valid format (max length = 1800)";
    return $val;
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
        if (isset($_GET["l"]) && htmlspecialchars($_GET["l"]) == "fr")
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
if (isset($_GET["c"]) && checkValidValue(htmlspecialchars($_GET["c"]))) {
    createClipboard(htmlspecialchars($_GET["c"]));
}

// create unique normal clipboard
if (isset($_GET["uc"]) && checkValidValue(htmlspecialchars($_GET["uc"]))) {
    createClipboard(htmlspecialchars($_GET["uc"]), "u");
}

// aggregate clipboard
if (isset($_GET["a"]) && checkValidValue(htmlspecialchars($_GET["a"]))) {
    $split = explode(':', htmlspecialchars($_GET["a"]), 2);
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

if (isset($_GET["p"]) && checkValidCode(htmlspecialchars($_GET["p"]))) {
    if (pasting(htmlspecialchars($_GET["p"])) == 1)
        echo "CPOI ERROR: " . $input . " is not a valid clipboard!";
}


// AUTOMATIC CLIPBOARD \\

// create or paste easy clipboard
if (isset($_GET["e"]) && checkValidValue(htmlspecialchars($_GET["e"]))) {
    if (checkValidCodeSilent(htmlspecialchars($_GET["e"]))) {
        if (pasting(htmlspecialchars($_GET["e"])) == 1)
            createClipboard(htmlspecialchars($_GET["e"]));
    } else
        createClipboard(htmlspecialchars($_GET["e"]));
}
