<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";

function activate(){
    $body = RequestAPI::getBody();
    if(isset($body['link'])){
        $users = getCommand("SELECT * FROM users WHERE activationLink = :link",$body);

        if(count($users) == 1){
            $result = putCommand("UPDATE `users` SET `activationLink` = '', isActive = 1 WHERE activationLink = :link",$body);
            print_r($result);
            message("Aktywowano pomyślnie");
        }
    }
}

if(RequestAPI::getMethod() == "POST"){
    echo activate();
}
