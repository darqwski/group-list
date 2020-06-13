<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Emails/confimAccount.php";

function registerNewUser(){
    $data = RequestAPI::getBody();
    $password = $data['password'];
    $link = md5($password.$data['login']);
    $existingUsers = getCommand("SELECT * FROM users WHERE email = :email",["email"=>$data['email']]);
    if(count($existingUsers) > 0){
        return message('Mail jest zajęty, spróbuj ponownie z innym');
    }
    sendMail("https://dariuszcabala.pl/grouplist/activations/?link=".$link, $data['email']);

    unset($data['password']);
    $result = insertCommand("
INSERT INTO `users` (`userId`, `email`, `login`, `password`, `registrationDate`,`activationLink`) 
VALUES (NULL, :email, :login, '".md5($password)."', NOW(),'$link');
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
