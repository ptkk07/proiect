<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['meal']) || !isset($data['calories']) || !isset($data['protein']) || !isset($data['date']) || !isset($data['category'])) {
        echo json_encode(['success' => false, 'message' => 'Date incomplete']);
        exit;
    }

    // category must be non-empty
    if (!is_string($data['category']) || trim($data['category']) === '') {
        echo json_encode(['success' => false, 'message' => 'Categoria este obligatorie']);
        exit;
    }
    
    try {
        $result = $database->meals->insertOne([
            'category' => $data['category'],
            'meal' => $data['meal'],
            'calories' => (int)$data['calories'],
            'protein' => (float)$data['protein'],
            'date' => $data['date'],
            'createdAt' => date('Y-m-d H:i:s')
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Masă adăugată',
            'id' => (string)$result->getInsertedId()
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
