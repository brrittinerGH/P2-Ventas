<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$usuario = "root";
$clave = "";
$base_datos = "bdfacturas";

$conexion = new mysqli($host, $usuario, $clave, $base_datos);

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida"]));
}

// Magia SQL: Sumamos los importes agrupados por MES y por SUCURSAL
$sql = "SELECT MONTH(FechaFactura) AS mes, idSucursal, SUM(Importe) AS total 
        FROM facturas 
        GROUP BY MONTH(FechaFactura), idSucursal";

$resultado = $conexion->query($sql);

// Preparamos un arreglo con los 12 meses en cero por defecto
$ventas = [];
for ($i = 1; $i <= 12; $i++) {
    $ventas[$i] = [
        "mes" => $i,
        "1" => 0, // Total Sucursal 1
        "2" => 0, // Total Sucursal 2
        "3" => 0, // Total Sucursal 3
        "4" => 0, // Total Sucursal 4
        "5" => 0  // Total Sucursal 5
    ];
}

// Llenamos los totales reales
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $mes = $fila["mes"];
        $sucursal = $fila["idSucursal"];
        $total = (float)$fila["total"]; // Convertimos a número
        
        if (isset($ventas[$mes][$sucursal])) {
            $ventas[$mes][$sucursal] = $total;
        }
    }
}

// Convertimos a JSON devolviendo solo los valores limpios
echo json_encode(array_values($ventas));
$conexion->close();
?>