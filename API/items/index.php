<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
session_start();
function addNewItem(){
    $data = RequestAPI::getBody();

    //TODO check if user is able to add to list
    $result = insertCommand("INSERT INTO `item` (`itemId`, `itemName`, `listId`, `status`) VALUES (NULL, :itemName, :listId, '0');",$data);
    if(!is_array($result)){
        return message('Dodano pomyślnie');
    }
    return print_r($result);
}
function toggleItem(){
    $data = RequestAPI::getBody();

    //TODO check if user is able to add to list
    $result = putCommand("UPDATE `item` SET `status` = (`status` + 1) % 2 WHERE `item`.`itemId` = $data[itemId];");
    if(!is_array($result)){
        return message('Zmieniono pomyślnie');
    }
    return print_r($result);
}

if(RequestAPI::getMethod() == "POST"){
    echo addNewItem();
} else if(RequestAPI::getMethod() == "PUT") {
    echo toggleItem();
}
