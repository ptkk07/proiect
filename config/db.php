<?php

header('Content-Type: application/json');

require_once __DIR__ . '/storage.php';

function send_json_error($message, $code = 500)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
$platformCheckPath = __DIR__ . '/../vendor/composer/platform_check.php';
if (file_exists($autoloadPath) && file_exists($platformCheckPath)) {
    require_once $autoloadPath;
}

$envPath = __DIR__ . '/../.env';
if (!file_exists($envPath)) {
    send_json_error('Lipsește fișierul .env.');
}

$env = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$config = [];

foreach ($env as $line) {
    $line = trim($line);

    if ($line === '' || $line[0] === '#') {
        continue;
    }

    if (strpos($line, '=') !== false) {
        list($key, $value) = explode('=', $line, 2);
        $config[trim($key)] = trim($value);
    }
}

if (!isset($config['MONGODB_URI']) || !isset($config['DB_NAME'])) {
    send_json_error('Variabilele MONGODB_URI și DB_NAME trebuie definite în .env.');
}

if (extension_loaded('mongodb') && class_exists('MongoDB\\Client')) {
    try {
        $client = new MongoDB\Client($config['MONGODB_URI']);
        $database = $client->{$config['DB_NAME']};
        return;
    } catch (Exception $e) {
        // Dacă Atlas nu e accesibil, folosim stocare locală ca să nu se rupă aplicația.
    }
}

$database = new JsonDatabase(__DIR__ . '/../data');

