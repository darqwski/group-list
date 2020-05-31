<?php
include_once ("_PHP/Modules/PageGenerator.php");
include_once ("_PHP/Modules/PDOController.php");
session_start();

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if(isset($_POST['login']) && isset($_POST['password'])){
        $login = $_POST['login'];
        $password =$_POST['password'];
        $data = [];
        $data['login'] = $login;
        $users = getCommand("SELECT * FROM users WHERE email = :login AND password = '".md5($password)."'",$data);
        if(count($users) == 1){
            $_SESSION['userId'] = $users[0]['userId'];
            $_SESSION['email'] = $users[0]['email'];
            $_SESSION['login'] = $users[0]['login'];
            header("Location: dashboard/");
        } else {
            echo "Login/Hasło są złe";
        }
    }
    else {
        echo "Brak loginu lub hasła";
    }
}
if(isset($_GET['logout'])){
    session_destroy();
    header('Location: /');
}
generatePage([
    'root'=>''
]);


