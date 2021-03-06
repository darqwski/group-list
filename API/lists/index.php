<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
include_once "../../_PHP/Modules/Privileges.php";
session_start();
function getUserLists(){
    $userId = $_SESSION['userId'];

   return (new Stream())
        ->getFromQuery("SELECT user_group.groupId FROM user_group WHERE user_group.userId = $userId")
        ->map(function ($groupId){
            $groupData = (new Stream())
                ->getFromQuery("
SELECT  lists.listName, lists.listId, lists.groupId, image, groups.groupId, colors.colorHex
FROM `lists` 
INNER JOIN groups ON groups.groupId = lists.groupId 
LEFT JOIN colors ON colors.colorId = groups.colorId 
LEFT JOIN icons ON lists.iconId = icons.iconId 
WHERE lists.groupId = $groupId[groupId]
")
                ->map(function ($list){
                    $items = getCommand("
SELECT itemId,itemName, status FROM item
WHERE listId = $list[listId] AND
(status = 0 OR status = 1 OR status IS NULL)");
                    $list['items'] = $items;
                    return $list;
                })
                ->get();
           return $groupData;
        })
       ->toJson();
}

function addNewList(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    $privilegeCheck = new Privileges($userId);

    if($privilegeCheck->isInGroup($data['groupId'])){
        $groups = getCommand("SELECT * FROM lists WHERE `groupId` = :groupId",['groupId'=>$data['groupId']]);
        if(count($groups)>=5){
            return message('Posiadasz już 5 list w tej grupie, aby dodać wiecęj zakup premium');
        }
        $result = insertCommand("INSERT INTO `lists` (`listId`, `groupId`, `listName`,`iconId`) VALUES (NULL, :groupId, :listName,:iconId);", $data);
        if(!is_array($result)){
            return message('Listę utworzono pomyślnie');
        }
        print_r($result);
    } else {
        http_response_code(403);
        return message('Nie masz uprawnień');
    }
}

function editList(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    if((new Privileges($userId))->canManageList($data['listId'])) {
        $result = putCommand("UPDATE `lists` SET `listName` = :listName, `iconId`= :iconId WHERE `lists`.`listId` = :listId;", $data);
        if(!is_array($result)){
            return message('Listę zmieniono pomyślnie');
        }
        print_r($result);
    } else {
        http_response_code(403);
        return message('Nie masz uprawnień');
    }

}
function deleteList(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    if((new Privileges($userId))->canManageList($data['listId'])) {
        $result = putCommand("UPDATE `lists` SET `groupId` = -1 WHERE `lists`.`listId` = :listId;", $data);
        if (!is_array($result)) {
            return message('Listę zmieniono pomyślnie');
        }
        print_r($result);
    } else {
        http_response_code(403);
        return message('Nie masz uprawnień');
    }
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
