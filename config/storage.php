<?php

if (!function_exists('db_normalize_id')) {
    function db_normalize_id($id)
    {
        if (class_exists('MongoDB\\BSON\\ObjectId')) {
            return new MongoDB\BSON\ObjectId((string) $id);
        }

        return (string) $id;
    }
}

if (!class_exists('JsonInsertOneResult')) {
    class JsonInsertOneResult
    {
        private $insertedId;

        public function __construct($insertedId)
        {
            $this->insertedId = $insertedId;
        }

        public function getInsertedId()
        {
            return $this->insertedId;
        }
    }
}

if (!class_exists('JsonDeleteResult')) {
    class JsonDeleteResult
    {
        private $deletedCount;

        public function __construct($deletedCount)
        {
            $this->deletedCount = $deletedCount;
        }

        public function getDeletedCount()
        {
            return $this->deletedCount;
        }
    }
}

if (!class_exists('JsonCursor')) {
    class JsonCursor
    {
        private $items;

        public function __construct(array $items)
        {
            $this->items = $items;
        }

        public function toArray()
        {
            return $this->items;
        }
    }
}

if (!class_exists('JsonCollection')) {
    class JsonCollection
    {
        private $filePath;

        public function __construct($filePath)
        {
            $this->filePath = $filePath;
            $directory = dirname($this->filePath);

            if (!is_dir($directory)) {
                mkdir($directory, 0777, true);
            }
        }

        public function insertOne(array $document)
        {
            if (!isset($document['_id'])) {
                $document['_id'] = bin2hex(random_bytes(12));
            }

            $documents = $this->loadDocuments();
            $documents[] = $document;
            $this->saveDocuments($documents);

            return new JsonInsertOneResult($document['_id']);
        }

        public function find(array $filter = [], array $options = [])
        {
            $documents = $this->filterDocuments($this->loadDocuments(), $filter);

            if (isset($options['sort']) && is_array($options['sort']) && !empty($options['sort'])) {
                $sortField = array_key_first($options['sort']);
                $sortDirection = (int) $options['sort'][$sortField];

                usort($documents, function ($left, $right) use ($sortField, $sortDirection) {
                    $leftValue = $left[$sortField] ?? '';
                    $rightValue = $right[$sortField] ?? '';

                    if ($leftValue === $rightValue) {
                        return 0;
                    }

                    $comparison = $leftValue <=> $rightValue;

                    return $sortDirection < 0 ? -$comparison : $comparison;
                });
            }

            return new JsonCursor($documents);
        }

        public function findOne(array $filter = [])
        {
            $documents = $this->filterDocuments($this->loadDocuments(), $filter);

            return $documents[0] ?? null;
        }

        public function deleteOne(array $filter = [])
        {
            $documents = $this->loadDocuments();
            $deletedCount = 0;

            foreach ($documents as $index => $document) {
                if ($this->documentMatches($document, $filter)) {
                    unset($documents[$index]);
                    $deletedCount = 1;
                    break;
                }
            }

            if ($deletedCount > 0) {
                $this->saveDocuments(array_values($documents));
            }

            return new JsonDeleteResult($deletedCount);
        }

        public function deleteMany(array $filter = [])
        {
            $documents = $this->loadDocuments();
            $remaining = [];
            $deletedCount = 0;

            foreach ($documents as $document) {
                if ($this->documentMatches($document, $filter)) {
                    $deletedCount++;
                    continue;
                }

                $remaining[] = $document;
            }

            if ($deletedCount > 0) {
                $this->saveDocuments($remaining);
            }

            return new JsonDeleteResult($deletedCount);
        }

        private function loadDocuments()
        {
            if (!file_exists($this->filePath)) {
                return [];
            }

            $contents = file_get_contents($this->filePath);
            if ($contents === false || trim($contents) === '') {
                return [];
            }

            $decoded = json_decode($contents, true);

            return is_array($decoded) ? $decoded : [];
        }

        private function saveDocuments(array $documents)
        {
            file_put_contents(
                $this->filePath,
                json_encode(array_values($documents), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
                LOCK_EX
            );
        }

        private function filterDocuments(array $documents, array $filter)
        {
            if (empty($filter)) {
                return $documents;
            }

            return array_values(array_filter($documents, function ($document) use ($filter) {
                return $this->documentMatches($document, $filter);
            }));
        }

        private function documentMatches(array $document, array $filter)
        {
            foreach ($filter as $key => $expectedValue) {
                $actualValue = $document[$key] ?? null;

                if ($key === '_id') {
                    if ((string) $actualValue !== (string) $expectedValue) {
                        return false;
                    }

                    continue;
                }

                if ($actualValue != $expectedValue) {
                    return false;
                }
            }

            return true;
        }
    }
}

if (!class_exists('JsonDatabase')) {
    class JsonDatabase
    {
        public $meals;
        public $workouts;
        public $goals;

        public function __construct($basePath)
        {
            $this->meals = new JsonCollection($basePath . DIRECTORY_SEPARATOR . 'meals.json');
            $this->workouts = new JsonCollection($basePath . DIRECTORY_SEPARATOR . 'workouts.json');
            $this->goals = new JsonCollection($basePath . DIRECTORY_SEPARATOR . 'goals.json');
        }
    }
}
