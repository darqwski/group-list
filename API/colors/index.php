<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
include_once "../../_PHP/Modules/Privileges.php";

function getIcons(){
    if(isset($_GET['type'])){
        $icons = getCommand("SELECT * FROM colors WHERE `type` = :type",$_GET);
        return json_encode($icons);
    }
    return (new Stream())->getFromQuery("SELECT * FROM colors")->toJson();
}



if(RequestAPI::getMethod() == "GET"){
    echo getIcons();
}
