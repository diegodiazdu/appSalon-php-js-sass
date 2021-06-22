<?php


$db = mysqli_connect('localhost','root', 'root', 'appsalon');//4 argumentos

if($db == null){
    echo "Error en la conexion";
    exit;
}
    //echo "Conexion correcta";

