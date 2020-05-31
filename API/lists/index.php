<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
session_start();
function getUserLists(){
    $userId = $_SESSION['userId'];

   return (new Stream())
        ->getFromQuery("SELECT user_group.groupId FROM user_group WHERE user_group.userId = $userId")
        ->map(function ($groupId){
            $groupData = (new Stream())
                ->getFromQuery("
SELECT itemId, lists.listName, lists.listId, lists.groupId, itemName, status 
FROM `lists` 
LEFT JOIN item ON item.listId = lists.listId WHERE lists.groupId = $groupId[groupId]")->groupBy('listId')->toArray()->get();
           return $groupData;
        })
       ->toJson();
}

function addNewList(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    //TODO sprawdzanie czy użytkownik może dodać do grupy listę, czy list jest mniej niż 3 oraz czy w grupie jest mniej niż 5 list
    $result = insertCommand("INSERT INTO `lists` (`listId`, `groupId`, `listName`) VALUES (NULL, :groupId, :listName);", $data);
    if(!is_array($result)){
        return message('Listę utworzono pomyślnie');
    }
    print_r($result);
}

function editList(){
    $userId = $_SESSION['userId'];
    //TODO sprawdzanie czy użytkownik może edytować listę

    $data = RequestAPI::getBody();
    $result = putCommand("UPDATE `lists` SET `listName` = :listName WHERE `lists`.`listId` = :listId;", $data);
    if(!is_array($result)){
        return message('Listę zmieniono pomyślnie');
    }
    print_r($result);

}
function deleteList(){
    $userId = $_SESSION['userId'];
    //TODO sprawdzanie czy użytkownik może usunąć listę

    $data = RequestAPI::getBody();
    $result = putCommand("UPDATE `lists` SET `groupId` = -1 WHERE `lists`.`listId` = :listId;", $data);
    if(!is_array($result)){
        return message('Listę zmieniono pomyślnie');
    }
    print_r($result);

}
if(RequestAPI::getMethod() == "GET"){
    echo getUserLists();
} else if(RequestAPI::getMethod() == "POST"){
    echo addNewList();
} else if(RequestAPI::getMethod() == "PUT"){
    echo editList();
} else if(RequestAPI::getMethod() == "DELETE"){
    echo deleteList();
}
