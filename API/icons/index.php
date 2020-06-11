<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
include_once "../../_PHP/Modules/Privileges.php";

function getIcons(){
    if(isset($_GET['iconName'])){
        $icon = getCommand("SELECT * FROM icons WHERE iconTitle = :iconName",$_GET);
        return json_encode($icon[0]);
    }
    if(isset($_GET['category'])){
        $icons = getCommand("SELECT * FROM icons WHERE category = :category",$_GET);
        return json_encode($icons);
    }
    return (new Stream())->getFromQuery("SELECT * FROM icons")->groupBy("category")->toJson();
}



if(RequestAPI::getMethod() == "GET"){
    echo getIcons();
}
