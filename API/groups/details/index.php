<?php
include_once "../../../_PHP/Modules/RequestAPI.php";
include_once "../../../_PHP/Modules/PDOController.php";
include_once "../../../_PHP/Modules/Utils.php";
include_once "../../../_PHP/Modules/Stream.php";
include_once "../../../_PHP/Modules/Privileges.php";
session_start();
function getGroupsDetails(){
    $userId = $_SESSION['userId'];
    $groups = (new Stream())
        ->getFromQuery("
SELECT user_group.groupId 
FROM user_group 
INNER JOIN groups on groups.groupId = user_group.groupId
WHERE user_group.userId = $userId AND groups.isActive = 1")
        ->get();
    $response = [];
    $response['groups'] = (new Stream($groups))
        ->map(function ($groupId){
            $groupData = getCommand("
SELECT groups.groupName, users.login, users.email, colorHex, colors.colorId, groupId FROM groups
INNER JOIN users ON users.userId = groups.adminId
LEFT JOIN colors on groups.colorId = colors.colorId
WHERE groups.groupId = $groupId[groupId]
            ")[0];
            $groupData['users'] = getCommand("
SELECT users.login, users.userId,users.email, groups.groupName FROM user_group
INNER JOIN users on users.userId = user_group.userId
INNER JOIN groups on groups.groupId = user_group.groupId
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
LEFT JOIN icons ON lists.iconId = icons.iconId 
WHERE groups.groupId = $groupId[groupId]
GROUP BY lists.listId
");
        return $groupData;
    })
        ->toArray()
        ->get();
   return (new Stream($response))->toJson();
}

function removeFromGroup(){
    $userId = $_SESSION['userId'];
    $data = RequestAPI::getBody();
    if((new Privileges($userId))->canManageGroup($data['groupId'])){
        $result = putCommand("DELETE FROM user_group WHERE groupId = :groupId AND userId = :userId", $data);
        if(!is_array($result)){
            return message("Użytkownik usunięty pomyślnie");
        }
        print_r($result);
    } else {
        http_response_code(403);
        return message('Brak uprawnień');
    }
}

if(RequestAPI::getMethod() == "GET"){
    echo getGroupsDetails();
} else if(RequestAPI::getMethod() == "DELETE"){
    echo removeFromGroup();
}
