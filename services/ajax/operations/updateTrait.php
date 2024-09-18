<?php

trait updateQuery {
    public function update(...$params) {
        $this->params = $params;

        global $mysqli;
        $value = "";
		$areaSet = [];
		
        $this->response['sql'] = "UPDATE ";

        $table = ($params[0] == 'mer') ? '`datos` ' : (($params[0] == 'tng') ? '`intervalos` ' : '');
        $this->response['sql'] .= $table;

        if ($params[0] == 'mer' && $params[2] == 'modal') {
            $value = urldecode($params[3]);
            $value = $mysqli->real_escape_string($value);
            $value = !empty($value) ? "'$value'" : 'NULL';
        }

        switch ($params[0]) {
            case 'mer':
                switch ($params[2]) {
                    case 'data':
                        $this->response['sql'] .= "SET `value` = '" . $params[3] . "', `timestamp`= NOW() ";
                        $this->response['sql'] .= ($params[6] != null) ? "WHERE id = " . $params[6] : "WHERE level = " . $params[4] . " AND breed = " . $params[5];
                        $this->response['message'] = 'Se ha actualizado la tarea.';
                        break;
                    case 'checkbox':
                        $this->response['sql'] .= "SET `tipo` = " . $params[3] . ", `timestamp`= NOW() ";
                        $this->response['sql'] .= ($params[6] != null) ? "WHERE id = " . $params[6] : "WHERE level = " . $params[4] . " AND breed = " . $params[5];
                        $this->response['message'] = 'Se ha actualizado el tipo de tarea.';
                        break;
                    case 'stat':
                        $this->response['sql'] .= "SET `area` = " . $params[3] . ", `timestamp`= NOW() ";
                        $this->response['sql'] .= ($params[6] != null) ? "WHERE id = " . $params[6] : "WHERE level = " . $params[4] . " AND breed = " . $params[5];
                        $this->response['message'] = 'Se ha actualizado el tipo de área.';
                        break;
                    case 'modal':
                        $this->response['sql'] .= "SET `observaciones` = " . $value . " ";
                        $this->response['sql'] .= ($params[6] != null) ? "WHERE `id` = " . $params[6] : "WHERE `level` = " . $params[4] . " AND `breed` = " . $params[5];
                        $this->response['message'] = 'Se ha actualizado la observación.';
                        break;
                    case 'leveling':
                        $this->response['sql'] .= "SET `level` = " . $params[4] . ", `breed` = " . $params[6] . ", `timestamp`= NOW() ";
                        $this->response['sql'] .= ($params[7] != null) ? "WHERE `id` = " . $params[7] : "WHERE `level` = " . $params[3] . " AND `breed` = " . $params[5];
                        $this->response['message'] = 'Se ha actualizado el campo de tarea.';
                        break;
 					case 'transfering':
                        $this->response['sql'] .= "SET `interval` = " . $params[3] . ", `timestamp`= NOW() ";
                        $this->response['sql'] .= ($params[4] != null) ? "WHERE `id` = " . $params[4] : "WHERE `level` = " . $params[5] . " AND `breed` = " . $params[6];
                        $this->response['message'] = 'Se ha trasladado a otro intervalo.';
                        break;                   
					case 'type':
                        $this->response['sql'] .= "SET `tipo` = " . $params[3] . ", `timestamp`= NOW() ";
                        $this->response['sql'] .= ($params[6] != null) ? "WHERE id = " . $params[6] : "WHERE level = " . $params[4] . " AND breed = " . $params[5];
                        $this->response['message'] = 'Se ha reintegrado una tarea periódica.';
                        break;
                }
                break;
            case 'tng':
				$areaSet = implode(",", array_map('intval', $params[6]));
			
                if ($params[2] == 'interval') {
                    $this->response['sql'] .= "SET `name`= '" . $params[3] . "',`horaStart`= '" . $params[4] . "',`horaEnd`='" . $params[5] . "',`idAreas`='[" . $areaSet . "]',`datetime`= NOW() ";
                    $this->response['sql'] .= "WHERE `id` = " . $params[7];
                    $this->response['message'] = 'Se ha modificado el intervalo correctamente.';
					
					$mysqli->query("UPDATE `datos` JOIN ( SELECT id FROM `datos` WHERE `interval` IN ('". $params[7] ."') AND `area` NOT IN (". $areaSet .") ) AS subquery ON `datos`.id = subquery.id SET `datos`.area = -1;");
                }
                break;
        }

        $result = $mysqli->query($this->response['sql']);

        if ($result && $params[0] == 'mer' && ($params[2] == 'leveling' || $params[2] == 'transfering')) {
            $mysqli->query("UPDATE datos t1 JOIN ( SELECT id, breed, ROW_NUMBER() OVER (PARTITION BY breed ORDER BY level ASC) as new_level FROM datos ) t2 ON t1.id = t2.id SET t1.level = t2.new_level;");
        }
		
		if ($result && $params[0] == 'mer' && $params[2] == 'transfering' && !$params[7]){
			$mysqli->query("UPDATE `datos` SET `area`= -1, `timestamp`= NOW() WHERE `id` = ". $params[4] .";");
		}
		

        return $this->response;
    }
}

?>
