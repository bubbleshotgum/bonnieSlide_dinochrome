<?php
    require_once realpath(__DIR__ . "vendor/autoload.php");

    use Dotenv\Dotenv;
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $refresh_token = getenv("RefreshToken");
    $client_id = getenv("ClientID");
    $client_secret = getenv("ClientSecret");
    $refresh_uri = "https://accounts.google.com/o/oauth2/token";
    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $refresh_uri);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            "client_id" => $client_id,
            "client_secret" => $client_secret,
            "refresh_token" => $refresh_token,
            "grant_type" => "refresh_token"
        ]));
        $res = curl_exec($ch);

        echo json_encode(["message" => $refresh_token . " " . $client_id . " " . $client_secret]);

        curl_close($ch);
    } catch(Exception $e) {
        echo json_encode(["message" => "Something went wrong"]);
    }

    // $request_uri = "https://sheets.googleapis.com/v4/spreadsheets/1OPT9rExu4-ILrHDFHF0HZoCzVVa-_4e4rsKrmfRiXR8/values/'Записи клиентов'";
    
    // try {

    // } catch (OAuthException $e) {

    // }
?>