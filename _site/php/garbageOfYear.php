<?php
ini_set("display_errors", 1);
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,"https://api.abfallplus.de/?key=b870ecfa6e1f882680758d374ba3fa2d&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=auswahl_strasse_set");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "f_id_kommune=3235&f_id_bezirk=216&f_id_strasse=848");

// receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close ($ch);

echo  $server_output;

?>