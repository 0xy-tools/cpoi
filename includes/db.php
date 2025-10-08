<?php

function dbConnect() : PDO
{
    try
    {
        $dbtoconnect = new PDO("mysql:host=localhost;dbname=insa;charset=utf8mb4", 'usr', 'passwordtochangewhichisnot1234');
    }
    catch (Exception $e)
    {
            die('Erreur : ' . $e->getMessage());
    }
    return $dbtoconnect;
}
?>