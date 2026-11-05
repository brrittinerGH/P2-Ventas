<?php
require_once "auth.php";
cabecerasCors();

$conexion = new mysqli("localhost", "root", "", "bdfacturas");
if ($conexion->connect_error) responder(500, ["error" => "Conexión fallida"]);

exigirRol($conexion, ['admin', 'vendedor']);

$metodo = $_SERVER['REQUEST_METHOD'];

// ---------- LISTAR ----------
if ($metodo === 'GET') {
    $resultado = $conexion->query(
        "SELECT idCliente, nombre, apellido, situacionFiscal, dni, estado FROM cliente"
    );
    $clientes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $fila["idCliente"] = (int)$fila["idCliente"];
        $fila["estado"]    = (int)$fila["estado"];
        $clientes[] = $fila;
    }
    responder(200, $clientes);
}

// ---------- ALTA ----------
if ($metodo === 'POST') {
    $d = json_decode(file_get_contents("php://input"), true);

    $nombre   = trim($d['nombre'] ?? '');
    $apellido = trim($d['apellido'] ?? '');
    $situacion = trim($d['situacionFiscal'] ?? '');
    $dni      = trim($d['dni'] ?? '');

    if ($nombre === '' || $apellido === '' || !ctype_digit($dni)) {
        responder(400, ["error" => "Nombre, apellido y DNI (solo números) son obligatorios"]);
    }

    $stmt = $conexion->prepare(
        "INSERT INTO cliente (nombre, apellido, situacionFiscal, dni, estado) VALUES (?, ?, ?, ?, 1)"
    );
    $stmt->bind_param("ssss", $nombre, $apellido, $situacion, $dni);

    if (!$stmt->execute()) {
        responder(500, ["error" => "No se pudo crear el cliente"]);
    }
    responder(201, ["idCliente" => $conexion->insert_id]);
}

// ---------- BAJA  ----------
if ($metodo === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) responder(400, ["error" => "Falta el id"]);

    $stmt = $conexion->prepare("UPDATE cliente SET estado = 0 WHERE idCliente = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    responder(200, ["ok" => true]);
}

responder(405, ["error" => "Método no permitido"]);