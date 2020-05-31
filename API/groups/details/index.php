<?php
include_once "../../../_PHP/Modules/RequestAPI.php";
include_once "../../../_PHP/Modules/PDOController.php";
include_once "../../../_PHP/Modules/Utils.php";
include_once "../../../_PHP/Modules/Stream.php";
session_start();
function getGroupsDetails(){
    $userId = $_SESSION['userId'];
    $groups = (new Stream())
        ->getFromQuery("SELECT user_group.groupId FROM user_group WHERE user_group.userId = $userId")
        ->get();
    $response = [];
    $response['groups'] = (new Stream($groups))
        ->map(function ($groupId){
            $groupData = getCommand("
SELECT users.login, users.email, groups.groupName, groups.groupId FROM user_group
LEFT JOIN users on users.userId = user_group.userId
LEFT JOIN groups on groups.groupId = user_group.groupId
WHERE groups.groupId = $groupId[groupId]
");
        return $groupData;
    })
        ->get();
    $response['lists'] = (new Stream($groups))
        ->map(function ($groupId){
        $groupData = getCommand("
SELECT *, groups.groupId FROM user_group
LEFT JOIN groups on groups.groupId = user_group.groupId
INNER JOIN lists on groups.groupId = lists.groupId
WHERE groups.groupId = $groupId[groupId]
GROUP BY lists.listId
");
        return $groupData;
    })
        ->toArray()
        ->get();
   return (new Stream($response))->toJson();
}

if(RequestAPI::getMethod() == "GET"){
    echo getGroupsDetails();
} else if(RequestAPI::getMethod() == "POST"){

}
