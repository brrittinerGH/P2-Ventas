<?php
$conexion = new mysqli("localhost", "root", "", "bdfacturas");

$usuario = "admin";
$clave   = "CambiaEstaClave123";   // cámbiala antes de ejecutar
$hash    = password_hash($clave, PASSWORD_DEFAULT);

$stmt = $conexion->prepare(
  "INSERT INTO usuario (usuario, passwordHash, rol) VALUES (?, ?, 'admin')"
);
$stmt->bind_param("ss", $usuario, $hash);
$stmt->execute();

echo $stmt->affected_rows === 1 ? "Admin creado" : "Error: " . $conexion->error;