<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";

function getUserGroups(){
    $userId = $_SESSION['userId'];
    
}

if(RequestAPI::getMethod() == "GET"){
    echo getUserGroups();
} else {
}
