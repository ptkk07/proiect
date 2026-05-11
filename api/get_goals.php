<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// GET - Returnează goals
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $goals = $database->goals->findOne([]);
        
        if ($goals) {
            $goals['_id'] = (string)$goals['_id'];
            echo json_encode(['success' => true, 'data' => $goals]);
        } else {
            // Goals default dacă nu există
            echo json_encode([
                'success' => true,
                'data' => [
                    'proteinGoal' => 120,
                    'caloriesGoal' => 2000,
                    'gymDaysGoal' => 4
                ]
            ]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
