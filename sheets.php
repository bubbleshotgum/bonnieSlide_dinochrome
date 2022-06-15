<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    $refresh_token = getenv("RefreshTOKEN");
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
            "grant_type" => "refresh_token",
            "refresh_token" => $refresh_token
        ]));
        $res = curl_exec($ch);
        // echo curl_error($ch); 
        curl_close($ch);

        echo json_encode($res);
        // return json_decode($res);
    } catch(Exception $e) {
        echo json_encode(["message" => "Fuck you"]);
    }

    // $request_uri = "https://sheets.googleapis.com/v4/spreadsheets/1OPT9rExu4-ILrHDFHF0HZoCzVVa-_4e4rsKrmfRiXR8/values/'Записи клиентов'";
    
    // try {

    // } catch (OAuthException $e) {

    // }
?>