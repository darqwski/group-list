<?php

define("MAX_USERS_PER_GROUP",20);
define("MAX_GROUPS_PER_USER",3);

function message($text){
    $data = [];
    $data['message'] = $text;

    return json_encode($data);
}

