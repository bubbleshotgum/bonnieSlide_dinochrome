<?php
    require_once realpath(__DIR__ . "/vendor/autoload.php");

    echo $_POST;
    return 0;
    use Dotenv\Dotenv;
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $access_token = null;
    $refresh_token = $_ENV["RefreshToken"];
    $client_id = $_ENV["ClientID"];
    $client_secret = $_ENV["ClientSecret"];
    $refresh_uri = "https://accounts.google.com/o/oauth2/token";

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $refresh_uri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            "client_id" => $client_id,
            "client_secret" => $client_secret,
            "refresh_token" => $refresh_token,
            "grant_type" => "refresh_token"
        ]));
        $res = curl_exec($ch);
        $decoded = json_decode($res);
        $access_token = $decoded->access_token;
        curl_close($ch);
    } catch(Exception $e) {
        echo json_encode(["message" => "Something went wrong"]);
    }

    $request_uri = "https://sheets.googleapis.com/v4/spreadsheets/1OPT9rExu4-ILrHDFHF0HZoCzVVa-_4e4rsKrmfRiXR8/values/";
    $next_id = null;

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $access_token
        ]);
        curl_setopt($ch, CURLOPT_URL, $request_uri . "A:A?majorDimension=COLUMNS");
        $res = curl_exec($ch);
        $decoded = json_decode($res);
        $last_value = array_slice($decoded->values[0], -1, 1);
        $next_id = $last_value == "ID" ? 1 : $last_value + 1;
    } catch (OAuthException $e) {
        echo json_encode(["message" => $e]);   
    }

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $request_uri . "A:A?majorDimension=COLUMNS");
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $access_token
        ]);
    } catch (OAuthException $e) {
        echo json_encode(["message" => "Something went wrong"]);
    }

?>