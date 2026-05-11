<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodă nepermisă']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$collectionName = $data['collection'] ?? '';

$allowedCollections = ['workouts', 'meals'];

if (!in_array($collectionName, $allowedCollections, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Colecție invalidă']);
    exit;
}

try {
    $result = $database->{$collectionName}->deleteMany([]);

    echo json_encode([
        'success' => true,
        'message' => 'Colecția a fost ștearsă',
        'deletedCount' => $result->getDeletedCount()
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>