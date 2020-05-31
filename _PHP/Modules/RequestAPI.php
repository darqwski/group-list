<?php
/**
 * Created by PhpStorm.
 * User: Darqwski
 * Date: 2020-01-17
 * Time: 12:46
 */

class RequestAPI
{
    public static function getBody(){
       return json_decode( file_get_contents('php://input'), true);
    }
    public static function getMethod(){
        return $_SERVER['REQUEST_METHOD'];
    }
}
