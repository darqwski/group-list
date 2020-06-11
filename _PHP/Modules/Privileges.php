<?php


class Privileges
{
    var $userId;
    public function __construct($userId = null)
    {
        $this->userId = $userId;
    }
    public function getConnectedLists(){
       return getCommand("
SELECT * FROM user_group 
INNER JOIN groups ON user_group.groupId = groups.groupId
INNER JOIN lists ON lists.groupId = groups.groupId
WHERE user_group.userId = :userId
",["userId"=>$this->userId]);
    }
    public function getConnectedGroups(){
        return getCommand("
SELECT * FROM user_group 
INNER JOIN groups ON user_group.groupId = groups.groupId
WHERE user_group.userId = :userId
",["userId"=>$this->userId]);
    }
    public function isInGroup($groupId){
        return getCommand("
SELECT * FROM user_group 
INNER JOIN groups ON user_group.groupId = groups.groupId
WHERE user_group.userId = :userId AND user_group.groupId = :groupId
",["userId"=>$this->userId,"groupId"=>$groupId]);
    }

    public function canManageGroup($groupId){
        return getCommand("
SELECT * FROM groups WHERE groupId = :groupId AND adminId = :userId
",["userId"=>$this->userId,"groupId"=>$groupId]);
    }

    public function canManageList($listId){
        return count(getCommand("
SELECT * FROM user_group 
INNER JOIN groups ON user_group.groupId = groups.groupId
INNER JOIN lists ON lists.groupId = groups.groupId
WHERE user_group.userId = :userId AND lists.listId = :listId
",["userId"=>$this->userId,"listId"=>$listId])) >= 0;
    }

    public function canManageItem($itemId) {
        return count(getCommand("
SELECT * FROM user_group 
INNER JOIN groups ON user_group.groupId = groups.groupId
INNER JOIN lists ON lists.groupId = groups.groupId
INNER JOIN item ON lists.listId = item.listId
WHERE user_group.userId = :userId AND item.itemId = :itemId
",["userId"=>$this->userId, "itemId"=>$itemId]))>=1;
    }

}
