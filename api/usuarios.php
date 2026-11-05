<?php
require_once "auth.php";
cabecerasCors();

$conexion = new mysqli("localhost", "root", "", "bdfacturas");
if ($conexion->connect_error) responder(500, ["error" => "Conexión fallida"]);

$yo = exigirRol($conexion, ['admin']);
$metodo = $_SERVER['REQUEST_METHOD'];

// ---------- LISTAR ----------
if ($metodo === 'GET') {
    $r = $conexion->query("SELECT idUsuario, usuario, rol FROM usuario ORDER BY usuario");
    $lista = [];
    while ($f = $r->fetch_assoc()) {
        $f["idUsuario"] = (int)$f["idUsuario"];
        $lista[] = $f;
    }
    responder(200, $lista);
}

// ---------- ALTA ----------
if ($metodo === 'POST') {
    $d = json_decode(file_get_contents("php://input"), true);

    $usuario = trim($d['usuario'] ?? '');
    $clave   = $d['clave'] ?? '';
    $rol     = $d['rol'] ?? '';

    if (!preg_match('/^[A-Za-z0-9_.-]{3,50}$/', $usuario)) {
        responder(400, ["error" => "Usuario: 3 a 50 caracteres (letras, números, _ . -)"]);
    }
    if (strlen($clave) < 8) {
        responder(400, ["error" => "La contraseña debe tener al menos 8 caracteres"]);
    }
    if (!in_array($rol, ['admin', 'vendedor'], true)) {
        responder(400, ["error" => "Rol inválido"]);
    }

    $hash = password_hash($clave, PASSWORD_DEFAULT);
    $stmt = $conexion->prepare("INSERT INTO usuario (usuario, passwordHash, rol) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $usuario, $hash, $rol);

    if (!$stmt->execute()) {
        // 1062 = clave duplicada (el usuario ya existe)
        if ($conexion->errno === 1062) responder(409, ["error" => "Ese usuario ya existe"]);
        responder(500, ["error" => "No se pudo crear el usuario"]);
    }
    responder(201, ["idUsuario" => $conexion->insert_id]);
}

// ---------- BAJA (física) ----------
if ($metodo === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) responder(400, ["error" => "Falta el id"]);
    if ($id === (int)$yo['idUsuario']) {
        responder(400, ["error" => "No puedes eliminar tu propio usuario"]);
    }

    $stmt = $conexion->prepare("DELETE FROM usuario WHERE idUsuario = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    responder(200, ["ok" => $stmt->affected_rows === 1]);
}

responder(405, ["error" => "Método no permitido"]);