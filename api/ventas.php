<?php
require_once "auth.php";
cabecerasCors();

$host = "localhost";
$usuario = "root";
$clave = "";
$base_datos = "bdfacturas";

$conexion = new mysqli($host, $usuario, $clave, $base_datos);

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida"]));
}

exigirRol($conexion, ['admin', 'vendedor']);

// Una fila por mes y sucursal (solo donde hubo ventas)
$sql = "SELECT MONTH(FechaFactura) AS mes, idSucursal, SUM(Importe) AS total
        FROM facturas
        GROUP BY MONTH(FechaFactura), idSucursal
        ORDER BY mes, idSucursal";

$resultado = $conexion->query($sql);

$ventas = [];
while ($fila = $resultado->fetch_assoc()) {
    $ventas[] = [
        "mes"        => (int)$fila["mes"],
        "idSucursal" => (int)$fila["idSucursal"],
        "total"      => (float)$fila["total"]
    ];
}

echo json_encode($ventas);
$conexion->close();
?>
