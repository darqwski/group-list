<?php
    /*
     * @param $command -> SQL COMMAND
     * Function bassicly for getting data from database
     * For :	SELECT FROM
     */
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
include_once "DB_PASS.php";

    function getCommand($command, $params = []){
        try {$db = new PDO(TEXT, LOGIN,PASSWORD);}
        catch (PDOException $e) {print "Failed to connect database!: " . $e->getMessage() . "<br/>";}
        $stmt = $db->prepare($command);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }
    /*
     * @param $command -> SQL COMMAND
     * Function bassicly for insert command which return only number of new,change records
     * For : INSERT INTO, UPDATE, DELETE FROM and TABLE modulators
     */
    function putCommand($command, $params = []){
        try {$db = new PDO(TEXT, LOGIN,PASSWORD);}
        catch (PDOException $e) {return "Failed to connect database!: " . $e->getMessage() . "<br/>";}
        $sth = $db->prepare($command);
        $formattedArray = [];
        foreach ($params as $key=>$param){
            $formattedArray[":$key"] = $param;
        }

        $sth->execute($formattedArray);
        if($sth->errorInfo()[0] != '00000'){
            print_r($sth->errorInfo());
            testQuery($command,$params);
            return $sth->errorInfo();
        }
    }

    function insertCommand($command,$params = []){
        try {$db = new PDO(TEXT, LOGIN,PASSWORD);}
        catch (PDOException $e) {return "Failed to connect database!: " . $e->getMessage() . "<br/>";}
        $sth = $db->prepare($command);
        $formattedArray = [];
        foreach ($params as $key=>$param){
            $formattedArray[":$key"] = $param;
        }

        $sth->execute($formattedArray);
        if($sth->errorInfo()[0] != '00000'){
            print_r($sth->errorInfo());
            testQuery($command,$params);
            return $sth->errorInfo();
        }
        $records = $db->query("SELECT LAST_INSERT_ID()");
        $return=$records->fetchAll(PDO::FETCH_ASSOC);

        return $return[0]['LAST_INSERT_ID()'];
    }
    function deleteCommand($command, $params = []){
        try {$db = new PDO(TEXT, LOGIN,PASSWORD);}
        catch (PDOException $e) {return "Failed to connect database!: " . $e->getMessage() . "<br/>";}
        $return = $db->exec($command);
        return $return;
    }
