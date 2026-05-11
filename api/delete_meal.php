<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// POST - Șterge masă
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'ID lipsit']);
        exit;
    }
    
    try {
        $result = $database->meals->deleteOne([
            '_id' => db_normalize_id($data['id'])
        ]);
        
        if ($result->getDeletedCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Masă ștearsă']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Masă nu găsită']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
