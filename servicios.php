<?php

require 'includes/functions.php';

$servicios = getServicios();

echo json_encode($servicios);

?>