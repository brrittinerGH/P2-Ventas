<?php
// api/auth.php

function cabecerasCors() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, X-Token");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");

    // El navegador manda un OPTIONS de "prueba" antes de un POST con headers propios
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function responder($codigo, $datos) {
    http_response_code($codigo);
    echo json_encode($datos);
    exit;
}

// Devuelve ["idUsuario"=>..., "usuario"=>..., "rol"=>...] o null si no hay sesión
function usuarioActual($conexion) {
    $token = $_SERVER['HTTP_X_TOKEN'] ?? '';
    if ($token === '') return null;

    $hash = hash('sha256', $token);
    $stmt = $conexion->prepare("SELECT idUsuario, usuario, rol FROM usuario WHERE token = ?");
    $stmt->bind_param("s", $hash);
    $stmt->execute();
    $u = $stmt->get_result()->fetch_assoc();
    return $u ?: null;
}

function exigirRol($conexion, $rolesPermitidos) {
    $u = usuarioActual($conexion);
    if (!$u) responder(401, ["error" => "No autenticado"]);
    if (!in_array($u['rol'], $rolesPermitidos)) responder(403, ["error" => "Sin permiso"]);
    return $u;
}