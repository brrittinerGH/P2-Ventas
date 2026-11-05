<?php
require_once "auth.php";
cabecerasCors();

$conexion = new mysqli("localhost", "root", "", "bdfacturas");
if ($conexion->connect_error) responder(500, ["error" => "Conexión fallida"]);

$metodo = $_SERVER['REQUEST_METHOD'];

// ---------- LISTAR ----------
if ($metodo === 'GET') {
    $sql = "SELECT idSucursal, nombre, ciudad, direccion, cantempleado, estado FROM sucursal";

    // Público: solo activas. Con ?todas=1 y sesión válida: también las dadas de baja
    $verTodas = false;
    if (($_GET['todas'] ?? '') === '1') {
        exigirRol($conexion, ['admin', 'vendedor']);
        $verTodas = true;
    }
    if (!$verTodas) $sql .= " WHERE estado = 1";

    $resultado = $conexion->query($sql);
    $sucursales = [];
    while ($fila = $resultado->fetch_assoc()) {
        $fila["idSucursal"]   = (int)$fila["idSucursal"];
        $fila["cantempleado"] = (int)$fila["cantempleado"];
        $fila["estado"]       = (int)$fila["estado"];
        $sucursales[] = $fila;
    }
    responder(200, $sucursales);
}

// ---------- ALTA y BAJA: solo admin ----------
exigirRol($conexion, ['admin']);

if ($metodo === 'POST') {
    $d = json_decode(file_get_contents("php://input"), true);

    $nombre    = trim($d['nombre'] ?? '');
    $ciudad    = trim($d['ciudad'] ?? '');
    $direccion = trim($d['direccion'] ?? '');
    $empleados = (int)($d['cantempleado'] ?? 0);

    if ($nombre === '' || $ciudad === '' || $direccion === '') {
        responder(400, ["error" => "Nombre, ciudad y dirección son obligatorios"]);
    }
    if ($empleados < 0) {
        responder(400, ["error" => "La cantidad de empleados no puede ser negativa"]);
    }

    $stmt = $conexion->prepare(
        "INSERT INTO sucursal (nombre, ciudad, direccion, cantempleado, estado) VALUES (?, ?, ?, ?, 1)"
    );
    $stmt->bind_param("sssi", $nombre, $ciudad, $direccion, $empleados);

    if (!$stmt->execute()) responder(500, ["error" => "No se pudo crear la sucursal"]);
    responder(201, ["idSucursal" => $conexion->insert_id]);
}

// Baja lógica
if ($metodo === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) responder(400, ["error" => "Falta el id"]);

    $stmt = $conexion->prepare("UPDATE sucursal SET estado = 0 WHERE idSucursal = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    responder(200, ["ok" => true]);
}

responder(405, ["error" => "Método no permitido"]);