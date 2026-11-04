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

$sql = "SELECT idSucursal, nombre, ciudad, direccion, cantempleado FROM sucursal";
$resultado = $conexion->query($sql);

$sucursales = [];
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $sucursales[] = $fila;
    }
}

echo json_encode($sucursales);
$conexion->close();
?>