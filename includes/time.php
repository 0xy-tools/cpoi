<?php
function getTime(int $d1, int $d2): string
{
        if ($d1 <= 1697832735)
                return "a long time ago";
        $diffMs = $d2 - $d1;
        $diffDays = floor($diffMs / 86400); //   days
        $diffHrs = floor(($diffMs % 86400) / 3600); // hours
        $diffMins = round((($diffMs % 86400) % 3600) / 60); // minutes
        $diffSecs = round(((($diffMs % 86400) % 3600) % 60)); // seconds
        return $diffDays . "d " . $diffHrs . "h " . $diffMins . "m " . $diffSecs . "s";
}
