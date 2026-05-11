<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// POST - Adaugă antrenament nou
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['exercise']) || !isset($data['sets']) || !isset($data['reps']) || !isset($data['date'])) {
        echo json_encode(['success' => false, 'message' => 'Date incomplete']);
        exit;
    }
    
    try {
        $result = $database->workouts->insertOne([
            'exercise' => $data['exercise'],
            'sets' => (int)$data['sets'],
            'reps' => (int)$data['reps'],
            'date' => $data['date'],
            'createdAt' => date('Y-m-d H:i:s')
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Antrenament adăugat',
            'id' => (string)$result->getInsertedId()
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
