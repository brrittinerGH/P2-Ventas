<?php
// api/logout.php
require_once "auth.php";
cabecerasCors();

$conexion = new mysqli("localhost", "root", "", "bdfacturas");
$u = usuarioActual($conexion);

if ($u) {
    $stmt = $conexion->prepare("UPDATE usuario SET token = NULL WHERE idUsuario = ?");
    $stmt->bind_param("i", $u['idUsuario']);
    $stmt->execute();
}
responder(200, ["ok" => true]);