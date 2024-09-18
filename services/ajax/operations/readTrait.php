<?php

trait readQuery {
    public function read(...$params) {
        $this->params = $params;

        global $mysqli;

        $this->response['sql'] = "SELECT * FROM ";
        $table = ($params[0] == 'mer') ? '`datos` ' : (($params[0] == 'tng') ? '`intervalos` ' : '');
        $this->response['sql'] .= $table;

        switch ($params[0]) {
            case 'mer':
                switch ($params[2]) {
                    case 'onload':
                        $interval = isset($params[3]) ? $params[3] : 0;
                        $area = isset($params[4]) ? (!empty($params[4]) ? "(" . str_replace(["[", "]"], ["", ""], $params[4]) . ", -1)" : "('ANY', -1)") : "";
                        $this->response['sql'] .= "WHERE `interval` = $interval " . ($area ? "AND `area` IN $area " : "") . "ORDER BY `breed` ASC, `level` ASC;";
                        break;
                    case 'modal':
                        $this->response['sql'] .= "WHERE `id` = " . $params[3] . ";";
                        break;
                    case 'type':
                        if ($params[3] == "*") {
                            $this->response['sql'] .= "ORDER BY `breed` ASC, `level` ASC;";
                        } else {
                            $this->response['sql'] .= "WHERE `tipo` = " . $params[3] . " ORDER BY `breed` ASC, `level` ASC;";
                        }
                        break;                    
					case 'unasigned':
                        $this->response['sql'] .= "WHERE `interval` = 0 ORDER BY `breed` ASC, `level` ASC;";
                        break;
                }
                break;
            case 'tng':
                if ($params[2] == 'onload') {
					$this->response['sql'] .= "ORDER BY `horaStart`;";
                    break;
                }
                
        }

        $result = $mysqli->query($this->response['sql']);

        if ($result) {
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_array()) {
                    switch ($params[0]) {
                        case 'mer':
                            switch ($params[2]) {
                                case 'onload':
                                case 'type':
								case 'unasigned':
                                    $this->response['message'] = ($params[2] == 'onload') ? 'Se han seleccionado datos por carga.' :
										(($params[2] == 'unasigned') ? 'Se han seleccionado datos sin asignar.' : 'Se han seleccionado datos por tipo.');
                                    $this->response['data'][] = [
                                        'id' => $row['id'],
                                        'level' => $row['level'],
                                        'interval' => $row['interval'],
                                        'value' => $row['value'],
                                        'breed' => $row['breed'],
                                        'area' => $row['area'],
                                        'tipo' => $row['tipo'],
                                        'timestamp' => $row['timestamp'],
                                    ];
									
									if ($params[2] == 'type') {
										$this->response['status'] = 1;
									}
									
                                    break;
                                case 'modal':
                                    $this->response['message'] = "Se han seleccionado datos de modal.";
                                    $o = ($row['observaciones'] !== null) ? htmlspecialchars($row['observaciones']) : null;
                                    $o = ($o !== null) ? str_replace("\t", '&emsp;&emsp;', $o) : null;
                                    $this->response['data'][] = [
                                        'level' => $row['level'],
                                        'value' => $row['value'],
                                        'breed' => $row['breed'],
                                        'observaciones' => $o,
                                        'timestamp' => $row['timestamp'],
                                    ];
                                    break;
                            }
                            break;
                        case 'tng':
                            if ($params[2] == 'onload') {
                                $this->response['message'] = 'Se han seleccionado intervalos por carga.';
                                $this->response['data'][] = [
                                    'id' => $row['id'],
                                    'name' => $row['name'],
                                    'horaStart' => $row['horaStart'],
                                    'horaEnd' => $row['horaEnd'],
                                    'idAreas' => $row['idAreas'],
                                    'datetime' => $row['datetime'],
                                ];
                            }
                            break;
                    }
                }
            } else {
                switch ($params[0]) {
                    case 'mer':
                        if ($params[2] == 'onload' || $params[2] == 'type' || $params[2] == 'unasigned') {
                            $this->response['message'] = 'No hay datos cargados.';
                            $this->response['data'] = [
                                'data_inexistent' => 0
                            ];
                            if ($params[2] == 'type') {
                                $this->response['status'] = 1;
                            }
                        }
                        break;
                    case 'tng':
                        if ($params[2] == 'onload') {
                            $this->response['message'] = 'No hay intervalos cargados.';
                            $this->response['data'] = [
                                'intervals_inexistent' => 0,
                            ];
                        }
                        break;
                }
            }
        } else {
            $this->response['message'] = "Hubo un problema de selección.";
        }

        return $this->response;
    }
}

?>
