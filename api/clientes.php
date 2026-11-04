<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$usuario = "root";
$clave = "";
$base_datos = "bdfacturas";

$conexion = new mysqli($host, $usuario, $clave, $base_datos);

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

// Consultamos la tabla cliente
$sql = "SELECT idCliente, nombre, apellido, situacionFiscal, dni FROM cliente";
$resultado = $conexion->query($sql);

$clientes = [];
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $clientes[] = $fila;
    }
}

echo json_encode($clientes);

$conexion->close();
?>