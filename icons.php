<?php
require_once "_PHP/Modules/PDOController.php";

$icons = getCommand("SELECT * FROM icons");
foreach ($icons as $icon){
    echo "
    <div>
    <img src='$icon[image]' />
    </div>
   ";
}
