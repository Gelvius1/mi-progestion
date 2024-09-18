<?php

trait createQuery {
    public function create(...$params) {
        $this->params = $params;
        
        global $mysqli;

        switch ($params[0]) {
            case 'mer':
                $this->response['sql'] = "INSERT INTO `datos`(`level`, `interval`, `value`, `breed`, `area`, `tipo`, `timestamp`) VALUES (". $params[4] .", ". $params[5] .", '". $params[3] ."', ". $params[2] .", -1, ". $params[6] .", NOW())";
				break;

            case 'tng':
                $this->response['sql'] = "INSERT INTO `intervalos`(`name`, `horaStart`, `horaEnd`, `idAreas`, `datetime`) VALUES ('". $params[3] ."', '". $params[4] ."', '". $params[5] ."', '". json_encode(array_map('intval', $params[6])) ."', NOW())";
                break;

            default:
                $this->response['sql'] = "";
                break;
        }

        $result = $mysqli->query($this->response['sql']);
		$this->response['data'] = $mysqli->insert_id;
        
		if ($result) {
            if ($params[0] == 'tng') {
                $mysqli->query("UPDATE `intervalos` JOIN (SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS orden FROM `intervalos`) AS sub ON `intervalos`.id = sub.id SET `intervalos`.id = sub.orden;");
            }

            $this->response['message'] = ($params[0] == 'mer') ? "Tarea insertada correctamente." : "Intervalo insertado correctamente.";
        } else {
            $this->response['message'] = ($params[0] == 'mer') ? "No se ha insertado la tarea." : "No se ha insertado el intervalo.";
        }

        return $this->response;
    }
}

?>