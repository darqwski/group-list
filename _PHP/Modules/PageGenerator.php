<?php

function importModule($link){
    $components = [];
    $components['css'] = [];
    $components['js'] = [];

    foreach (glob("$link") as $dirName) {
        foreach (glob("$dirName/*.css") as $fileName){
            array_push($components['css'], "<link rel='stylesheet' href='$fileName'/>" );
        }
        foreach (glob("$dirName/*.js") as $fileName){
            array_push($components['js'], "<script src='$fileName'></script>");
        }
    }

    return $components;
}

function importComponents($data){
    return importModule("$data[root]static/common/*");
}
function importModuleComponent($data){
    return importModule("$data[root]static/app$_SERVER[REQUEST_URI]");
}


///$_SERVER['REQUEST_URI']
function generatePage($data = []){
    $rootPath = $data['root'];
    if(isset($data['requireLogin'])){

    }
    $template = file_get_contents($rootPath.'_PHP/Modules/template.html');
    $components = importComponents($data);
    $modules = importModuleComponent($data);

    $template = str_replace('$scripts',implode("", array_merge($components['js'],$modules['js'])),$template);
    $template = str_replace('$styles',implode("",array_merge($components['css'],$modules['css'])),$template);

    echo $template;

}
