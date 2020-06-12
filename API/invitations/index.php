<?php
include_once "../../_PHP/Modules/RequestAPI.php";
include_once "../../_PHP/Modules/PDOController.php";
include_once "../../_PHP/Modules/Utils.php";
include_once "../../_PHP/Modules/Stream.php";
include_once "../../_PHP/Modules/Privileges.php";
session_start();

function getInvitations(){
    $type = $_GET['type'];
    $sqlQuery = "";
    if($type=='receiver'){
        $sqlQuery ="
SELECT users.login, users.email, groups.groupName, invitations.datetime,invitations.invitationId FROM `invitations` 
INNER JOIN users ON invitations.inviteSender = users.userId
INNER JOIN groups ON groups.groupId = invitations.groupId
WHERE invitations.status = 0 AND invitations.inviteReceiver = $_SESSION[userId]";
    } else if($type=='sender'){
        $sqlQuery = "
SELECT users.login, users.email, groups.groupName, invitations.datetime,invitations.invitationId FROM `invitations` 
INNER JOIN users ON invitations.inviteReceiver = users.userId
INNER JOIN groups ON groups.groupId = invitations.groupId
WHERE invitations.status = 0 AND invitations.inviteSender = $_SESSION[userId]";
    }
    return (new Stream())->getFromQuery($sqlQuery)->toJson();
}

function invitePerson(){
    $data = RequestAPI::getBody();
    $userId = $_SESSION['userId'];
    $person = $data['email'];
    $group = $data['groupId'];
    $matchingPerson = getCommand("SELECT userId FROM users WHERE email = :email", ['email'=>$person]);
    if( count($matchingPerson) == 0){
        return message('Brak osoby w bazie');
    }
    $inviteReceiver = $matchingPerson[0]['userId'];

    $alreadyInvited = getCommand("
SELECT inviteReceiver FROM invitations WHERE inviteReceiver=:userId AND groupId=:groupId AND status = 0
",['userId'=>$inviteReceiver,'groupId'=>$group]);
    if(count($alreadyInvited)>0){
        return message('Użytkownik otrzymał już zaproszenie wcześniej');
    }

    $usersInGroup = getCommand("SELECT * FROM invitations WHERE groupId = :groupId",["groupId"=>$group]);
    if(count($usersInGroup)> MAX_USERS_PER_GROUP){
        return message("Przekroczono liczbę członków na grupę (max ".MAX_USERS_PER_GROUP."), aby zaprosić więcej osób usuń istniejące zaproszenia, lub zakup konto premium");
    }

    insertCommand("
INSERT INTO `invitations` (`invitationId`, `inviteSender`, `inviteReceiver`, `datetime`,`groupId`, `status`)
VALUES (NULL, '$userId', '$inviteReceiver', NOW(), :group, '0');", ['group'=>$group]);

    return message("Użytkownik został zaproszony");

}
function acceptInvitation(){
    $data = RequestAPI::getBody();
    $invitation = getCommand("SELECT * FROM invitations WHERE invitationId = :invitationId", $data)[0];
    if($invitation['inviteReceiver'] != $_SESSION['userId']){
        return;
    }
    if(count((new Privileges($_SESSION['userId']))->getConnectedGroups())>=MAX_GROUPS_PER_USER){
        return message("Nie możesz dołączyć do grupy ponieważ maksymalna ilość dołączonych grup to ".MAX_GROUPS_PER_USER);
    }
    insertCommand("INSERT INTO `user_group` (`userGroupId`, `userId`, `groupId`) VALUES (NULL, '$invitation[inviteReceiver]', '$invitation[groupId]');");
    putCommand("UPDATE `invitations` SET `status` = '1' WHERE `invitations`.`invitationId` = :invitationId;", $data);

    return message("Zaproszenie przyjęto");

}
function rejectInvitation(){
    $data = RequestAPI::getBody();
    $invitation = getCommand("SELECT * FROM invitations WHERE invitationId = :invitationId", $data)[0];
    if($invitation['inviteReceiver'] != $_SESSION['userId']){
        return;
    }
    putCommand("UPDATE `invitations` SET `status` = '-1' WHERE `invitations`.`invitationId` = :invitationId;", $data);

    return message("Zaproszenie odrzucono");

}

if(RequestAPI::getMethod() == "GET"){
    echo getInvitations();
} else if(RequestAPI::getMethod() == "POST"){
    echo invitePerson();
} else if(RequestAPI::getMethod() == "PUT"){
    echo acceptInvitation();
} else if(RequestAPI::getMethod() == "DELETE"){
    echo rejectInvitation();
}
