<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
include_once "../../_PHP/Modules/Privileges.php";
session_start();
function addNewItem(){
    $data = RequestAPI::getBody();
    if((new Privileges($_SESSION['userId']))->canManageList($data['listId'])) {
        $result = insertCommand("INSERT INTO `item` (`itemId`, `itemName`, `listId`, `status`) VALUES (NULL, :itemName, :listId, '0');",$data);
        if(!is_array($result)){
            return message('Dodano pomyślnie');
        }
        return print_r($result);
    } else {
        http_response_code(403);
        return message('Nie masz uprawnień');
    }

}
function toggleItem(){
    $data = RequestAPI::getBody();

    if((new Privileges($_SESSION['userId']))->canManageItem($data['itemId'])){
        $result = putCommand("UPDATE `item` SET `status` = (`status` + 1) % 2 WHERE `item`.`itemId` = $data[itemId];");
        if(!is_array($result)){
            return message('Zmieniono pomyślnie');
        }
        return print_r($result);
    } else {
        http_response_code(403);
        return message('Nie masz uprawnień');
    }

}
function deleteItem(){
    $data = RequestAPI::getBody();

    $result = putCommand("DELETE FROM `item` WHERE `item`.`itemId` = $data[itemId];");
    if(!is_array($result)){
        return message('Usunięto pomyślnie');
    }
    return print_r($result);
}

if(RequestAPI::getMethod() == "POST"){
    echo addNewItem();
} else if(RequestAPI::getMethod() == "PUT") {
    echo toggleItem();
}else if(RequestAPI::getMethod() == "DELETE") {
    echo deleteItem();
}
