<?php
function getTime(int $d1, int $d2): string
{
        $diffMs = $d2 - $d1;
        $diffDays = floor($diffMs / 86400); //   days
        $diffHrs = floor(($diffMs % 86400) / 3600); // hours
        $diffMins = round((($diffMs % 86400) % 3600) / 60); // minutes
        $diffSecs = round(((($diffMs % 86400) % 3600) % 60)); // seconds
        return $diffDays . "d " . $diffHrs . "h " . $diffMins . "m " . $diffSecs . "s";
}

function generateRandomString($length = 4)
{
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }

        return $randomString;
}