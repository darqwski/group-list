<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
include_once "../../_PHP/Modules/Privileges.php";
session_start();
function getUserGroups(){
    $userId = $_SESSION['userId'];

   return (new Stream())
        ->getFromQuery("
SELECT user_group.groupId 
FROM user_group
INNER JOIN groups on groups.groupId = user_group.groupId
WHERE user_group.userId = $userId AND groups.isActive = 1")
        ->map(function ($groupId){

            $groupData = getCommand("
SELECT users.login, users.email, groups.groupName FROM user_group
INNER JOIN users on users.userId = user_group.userId
INNER JOIN groups on groups.groupId = user_group.groupId
WHERE groups.groupId = $groupId[groupId]
");
           return $groupData;
        })
       ->toJson();
}
function addGroup(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();

    if(count((new Privileges($_SESSION['userId']))->getConnectedGroups())>=MAX_GROUPS_PER_USER){
        return message(
            "Nie możesz utworzyćgrupy ponieważ maksymalna ilośćgrup to "
            .MAX_GROUPS_PER_USER
            .", aby posiadać więcej grup, kup konto premium"
        );
    }
    $result = insertCommand("INSERT INTO `groups` 
(`groupId`, `groupName`, `adminId`, `creationDate`) VALUES (NULL, :groupName, '$userId', NOW());", $data);
    if(!is_array($result)){
        insertCommand("INSERT INTO `user_group` (`userGroupId`, `userId`, `groupId`) VALUES (NULL, '$userId', '$result');");
        return message('Grupę utworzono pomyślnie');
    }
    print_r($result);
}

function editGroup(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    if((new Privileges($userId))->canManageGroup($data['groupId'])){
        $result = putCommand("UPDATE `groups` SET `groupName` = :groupName, `colorId` = :colorId WHERE `groups`.`groupId` = :groupId;", $data);
        if(!is_array($result)){
            return message('Grupę zmieniono pomyślnie');
        }
        print_r($result);
    } else {
        http_response_code(403);
        return message('Brak uprawnień');
    }



}
function deleteGroup(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    if((new Privileges($userId))->canManageGroup($data['groupId'])) {
        $result = putCommand("UPDATE `groups` SET `isActive` = 0 WHERE `groups`.`groupId` = :groupId;", $data);
        if(!is_array($result)){
            return message('Grupę usunięto pomyślnie');
        }
        print_r($result);
    } else {
        http_response_code(403);
        return message('Brak uprawnień');
    }
}

if(RequestAPI::getMethod() == "GET"){
    echo getUserGroups();
} else if(RequestAPI::getMethod() == "POST"){
    echo addGroup();
} else if(RequestAPI::getMethod() == "PUT"){
    echo editGroup();
} else if(RequestAPI::getMethod() == "DELETE"){
    echo deleteGroup();
}
