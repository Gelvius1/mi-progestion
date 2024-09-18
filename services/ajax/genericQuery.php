<?php

include('../db/connection.php');

require_once 'operations/createTrait.php';
require_once 'operations/readTrait.php';
require_once 'operations/updateTrait.php';
require_once 'operations/deleteTrait.php';

class genericQuery {
    protected $response = [
        'sql' => '',
        'message' => '',
		'data' => [],
		'status' => 0,
    ];
	
	use readQuery, createQuery, deleteQuery, updateQuery;
	
    public function init(...$params) {
        $this->params = $params;

        $values = $params[0];

        switch ($values[1]) {
            case 'create':
                return $this->create(...$values);
            case 'erase':
                return $this->erase(...$values);
            case 'update':
                return $this->update(...$values);
            case 'read':
                return $this->read(...$values);
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	
	$genericQuery = new genericQuery();
	
    $data = json_decode($_POST['values'], true);

	$response = $data === null ? ['error' => 'Error al decodificar la cadena JSON.'] : $response = $genericQuery->init([...$data]);;
	
	echo json_encode($response);
	
} else {
	
    echo json_encode(['error' => 'Solicitúd no válida']);

}

?>