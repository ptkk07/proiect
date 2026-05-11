<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// GET - Returnează toate antrenamentele
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $workouts = $database->workouts
            ->find([], ['sort' => ['date' => -1]])
            ->toArray();
        
        // Convertim ObjectId în string pentru JSON
        $workouts = array_map(function($w) {
            $w['_id'] = (string)$w['_id'];
            return $w;
        }, $workouts);
        
        echo json_encode(['success' => true, 'data' => $workouts]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
