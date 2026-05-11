<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// GET - Returnează toate mese
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $meals = $database->meals
            ->find([], ['sort' => ['date' => -1]])
            ->toArray();
        
        // Convertim ObjectId în string pentru JSON
        $meals = array_map(function($m) {
            $m['_id'] = (string)$m['_id'];
            return $m;
        }, $meals);
        
        echo json_encode(['success' => true, 'data' => $meals]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

?>
