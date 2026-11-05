<?php
// api/login.php
require_once "auth.php";
cabecerasCors();

$conexion = new mysqli("localhost", "root", "", "bdfacturas");
if ($conexion->connect_error) responder(500, ["error" => "Conexión fallida"]);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, ["error" => "Usar POST"]);

$entrada = json_decode(file_get_contents("php://input"), true);
$usuario = trim($entrada['usuario'] ?? '');
$clave   = $entrada['clave'] ?? '';

$stmt = $conexion->prepare("SELECT idUsuario, passwordHash, rol FROM usuario WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();

if (!$u || !password_verify($clave, $u['passwordHash'])) {
    responder(401, ["error" => "Usuario o contraseña incorrectos"]);
}

// Token aleatorio: se lo damos a Angular y guardamos solo su hash
$token = bin2hex(random_bytes(32));
$hash  = hash('sha256', $token);

$stmt = $conexion->prepare("UPDATE usuario SET token = ? WHERE idUsuario = ?");
$stmt->bind_param("si", $hash, $u['idUsuario']);
$stmt->execute();

responder(200, [
    "token"   => $token,
    "usuario" => $usuario,
    "rol"     => $u['rol']
]);