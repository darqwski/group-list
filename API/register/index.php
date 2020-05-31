<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";

function registerNewUser(){
    $data = RequestAPI::getBody();
    $password = $data['password'];
    unset($data['password']);
    $result = insertCommand("
INSERT INTO `users` (`userId`, `email`, `login`, `password`, `registrationDate`) 
VALUES (NULL, :email, :login, '".md5($password)."', NOW());
",$data);
    if(!is_array($result)){
        return message('OK');
    }
    return json_encode($result);
}

if(RequestAPI::getMethod() == "POST"){
    echo registerNewUser();
} else {
}
