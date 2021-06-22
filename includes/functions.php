<?php
header("Content-Type: text/html;charset=utf-8");

function getServicios():array
{
    try {

        //Importar conexion

        require 'database.php';
        $acentos = $db->query("SET NAMES 'utf8'");
        //Soluciona errores con ñ y tildes
        
        //Escribir codigo SQL
        $sql = "SELECT * FROM servicios";

        $consultaSelect = mysqli_query($db, $sql);

        //Arreglo vacio
        $servicios = [];
        $i = 0;

        //Obtener resultados
        while ($row = mysqli_fetch_assoc($consultaSelect)) {

            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
        }

       return $servicios;


    } catch (\Throwable $th) {


        var_dump($th);
    }
}

getServicios();
