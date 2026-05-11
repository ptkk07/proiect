<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// POST - Setează goals
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['proteinGoal']) || !isset($data['caloriesGoal']) || !isset($data['gymDaysGoal'])) {
        echo json_encode(['success' => false, 'message' => 'Date incomplete']);
        exit;
    }
    
    try {
        // Șterge goals vechi și adaugă noul
        $database->goals->deleteMany([]);
        
        $result = $database->goals->insertOne([
            'proteinGoal' => (float)$data['proteinGoal'],
            'caloriesGoal' => (int)$data['caloriesGoal'],
            'gymDaysGoal' => (int)$data['gymDaysGoal'],
            'updatedAt' => date('Y-m-d H:i:s')
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Obiective salvate',
            'id' => (string)$result->getInsertedId()
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
