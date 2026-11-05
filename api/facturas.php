<?php
require_once "auth.php";
cabecerasCors();

$conexion = new mysqli("localhost", "root", "", "bdfacturas");
if ($conexion->connect_error) responder(500, ["error" => "Conexión fallida"]);

exigirRol($conexion, ['admin', 'vendedor']);

$metodo = $_SERVER['REQUEST_METHOD'];

// ---------- LISTAR  ----------
if ($metodo === 'GET') {
    $limite = (int)($_GET['limite'] ?? 20);
    if ($limite < 1 || $limite > 100) $limite = 20;
    $pagina = max(1, (int)($_GET['pagina'] ?? 1));
    $offset = ($pagina - 1) * $limite;

    $total = (int)$conexion->query("SELECT COUNT(*) AS n FROM facturas")->fetch_assoc()['n'];

    $stmt = $conexion->prepare(
        "SELECT f.NroFactura, f.FechaFactura, f.Importe, f.IVA, f.Estado,
                c.apellido, c.nombre AS nombreCliente,
                s.nombre AS sucursal
         FROM facturas f
         JOIN cliente  c ON c.idCliente  = f.IdCliente
         JOIN sucursal s ON s.idSucursal = f.idSucursal
         ORDER BY f.FechaFactura DESC, f.NroFactura DESC
         LIMIT ? OFFSET ?"
    );
    $stmt->bind_param("ii", $limite, $offset);
    $stmt->execute();
    $r = $stmt->get_result();

    $items = [];
    while ($f = $r->fetch_assoc()) {
        $f["NroFactura"] = (int)$f["NroFactura"];
        $f["Importe"]    = (float)$f["Importe"];
        $f["IVA"]        = (float)$f["IVA"];
        $items[] = $f;
    }

    responder(200, [
        "total"  => $total,
        "pagina" => $pagina,
        "limite" => $limite,
        "items"  => $items
    ]);
}

// ---------- ALTA ----------
if ($metodo !== 'POST') responder(405, ["error" => "Método no permitido"]);

$d = json_decode(file_get_contents("php://input"), true);

$fecha      = trim($d['fecha'] ?? '');
$idSucursal = (int)($d['idSucursal'] ?? 0);
$idCliente  = (int)($d['idCliente'] ?? 0);
$importe    = (float)($d['importe'] ?? 0);

$f = DateTime::createFromFormat('Y-m-d', $fecha);
if (!$f || $f->format('Y-m-d') !== $fecha) {
    responder(400, ["error" => "Fecha inválida"]);
}
if ($importe <= 0) {
    responder(400, ["error" => "El importe debe ser mayor a 0"]);
}
const ALICUOTA_IVA = 0.21;
$iva = round($importe * ALICUOTA_IVA, 2);

$stmt = $conexion->prepare("SELECT estado FROM cliente WHERE idCliente = ?");
$stmt->bind_param("i", $idCliente);
$stmt->execute();
$cli = $stmt->get_result()->fetch_assoc();
if (!$cli) responder(400, ["error" => "El cliente no existe"]);
if ((int)$cli['estado'] !== 1) responder(400, ["error" => "El cliente está dado de baja"]);

$stmt = $conexion->prepare("SELECT estado FROM sucursal WHERE idSucursal = ?");
$stmt->bind_param("i", $idSucursal);
$stmt->execute();
$suc = $stmt->get_result()->fetch_assoc();
if (!$suc) responder(400, ["error" => "La sucursal no existe"]);
if ((int)$suc['estado'] !== 1) responder(400, ["error" => "La sucursal está dada de baja"]);

$stmt = $conexion->prepare(
    "INSERT INTO facturas (FechaFactura, idSucursal, Importe, IdCliente, IVA, Estado)
     VALUES (?, ?, ?, ?, ?, 'Pendiente')"
);
$stmt->bind_param("sidid", $fecha, $idSucursal, $importe, $idCliente, $iva);

if (!$stmt->execute()) responder(500, ["error" => "No se pudo crear la factura"]);

responder(201, ["NroFactura" => $conexion->insert_id]);