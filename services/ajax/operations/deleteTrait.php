<?php

trait deleteQuery {
    public function erase(...$params) {
        $this->params = $params;
        
        global $mysqli;

        switch ($params[0]) {
            case 'mer':
                $result = $mysqli->query("SELECT * FROM `datos` WHERE tipo = 1 AND level = ". $params[2] ." AND breed = ". $params[3]);        
                
                if ($result->num_rows > 0) {
                    $this->response['sql'] = "UPDATE `datos` SET `tipo`= 2,`timestamp`= NOW() WHERE ";
                    $this->response['sql'] .= $params[4] ? "id = ". $params[4] : "level = ". $params[2] ." AND breed = ". $params[3];
                    $result = $mysqli->query($this->response['sql']);

                    $this->response['message'] = "Se ha borrado la tarea periódica.";
                } else {
                    $this->response['sql'] = "DELETE FROM `datos` WHERE ";
                    $this->response['sql'] .= $params[4] ? "id = ". $params[4] : "level = ". $params[2] ." AND breed = ". $params[3];                
                    $result = $mysqli->query($this->response['sql']);        
                    
                    $mysqli->query('UPDATE datos t1 JOIN ( SELECT id, breed, ROW_NUMBER() OVER (PARTITION BY breed ORDER BY level ASC) as new_level FROM datos ) t2 ON t1.id = t2.id SET t1.level = t2.new_level;');
                    
                    $this->response['message'] = "Se ha borrado la tarea ocasional.";
                }
                break;
                
            case 'tng':
                $mysqli->query("UPDATE `datos` SET `interval` = 0 WHERE `interval` IN (" . implode(',', $params[2]) . ")");            

                $this->response['sql'] = "DELETE FROM `intervalos` WHERE `id` IN (" . implode(',', $params[2]) . ")";
                $result = $mysqli->query($this->response['sql']);
                
                $mysqli->query("UPDATE datos t1 JOIN ( SELECT id, breed, ROW_NUMBER() OVER (PARTITION BY breed ORDER BY level ASC) as new_level FROM datos ) t2 ON t1.id = t2.id SET t1.level = t2.new_level;");
                
                $this->response['message'] = "Se ha borrado el intervalo correctamente.";                
                break;
        }

        return $this->response;
    }    
}
?>
