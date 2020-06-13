<?php

require_once "../../_PHP/PHPMailer/src/PHPMailer.php";
require_once "../../_PHP/PHPMailer/src/Exception.php";
require_once "../../_PHP/PHPMailer/src/SMTP.php";
require_once "../../_PHP/Modules/PDOController.php";
require_once "../../_PHP/Emails/EMAIL_PASS.php";

function populateData($template, $data){
    foreach ($data as $key=>$item){
        $template = str_replace(":$key",$item,$template);
    }
    return $template;
}

function sendMail($link, $address){
    $mail = new \PHPMailer\PHPMailer\PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPDebug = 0;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = "ssl";
    $mail->Port = 465;
    $mail->Host = HOST;
    $mail->Username = EMAIL;
    $mail->Password = EMAIL_PASSWORD;
    $mail->setFrom(EMAIL);
    $mail->AddAddress($address);
    $mail->addCustomHeader("Content-type","text/html; charset=utf-8");
    $mail->Subject = "Potwierdzenie rejestracji";
    $mail->isHTML(true);

    $mailBody = file_get_contents("../../_PHP/Emails/emailTemplate.html");

    $mail->Body = populateData($mailBody,[
        "mailTitle"=>"Potwierdzenie rejestracji",
        "primarySection"=>"Dziękujemy za rejestrację w Listach grupowych, aby aktywować konto musisz wejść w ten <a href='$link'>LINK AKTYWACYJNY</a>",
        "secondarySection"=>"Po przejściu w link twoje konto aktywne, dzięki czemu możesz korzystać z List Grupowych. Aby w pełni korzystać z portaluistnieje możliwość zakupienia konta premium",
        "footer"=>"Email wygenerowane przez GroupList ".date('Y-m-d')
    ]);
    if (!$mail->send()) {
        echo "ERROR: " . $mail->ErrorInfo;
    } else {
    }

}

