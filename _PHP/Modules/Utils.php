<?php
function message($text){
    $data = [];
    $data['message'] = $text;

    return json_encode($data);
}

