<?php

function getDiseases(){
    $notModified = false;
    if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
        $requestedDate = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
        if ($requestedDate >= getLastModified()) {
            $notModified = true;
        }
    }

    if ($notModified) {
        header("HTTP/1.1 304 NOT MODIFIED");
        header('last-modified: ' . gmdate(DATE_RFC850, getLastModified()));
        exit;
    } else {
        $query="select * FROM disease ORDER BY name";
        try{
            global $db;
            $diseases = $db->query($query);
            $diseases = $diseases->fetchAll(PDO::FETCH_ASSOC);
            header('last-modified: ' . gmdate(DATE_RFC850, getLastModified()));
            echo'{"disease": '.json_encode($diseases).'}';
        }
        catch(PDOException $e){
            echo '{"error":{"text":'.$e->getMessage() .'}}';
        }
    }
}

function getLastModified() {
    $query = "SELECT timestamp from disease order by timestamp DESC LIMIT 1";
    try{
        global $db;
        $diseases = $db->query($query);
        $diseases = $diseases->fetch(PDO::FETCH_ASSOC);
        $theDate = strtotime($diseases['timestamp']);
        return $theDate;
    }
    catch(PDOException $e){
        echo '{"error":{"text":'.$e->getMessage() .'}}';
        return time();
    }
}

function addDisease() {
    global $app;
	$request = $app->request();
	$disease = json_decode($request->getBody());
	$name = $disease->name;
	$infected = $disease->infected;
	$deathtoll = $disease->deathtoll;
	$query= "INSERT INTO disease
                 (name, infected, deathtoll)
              VALUES
                 ('$name', '$infected', '$deathtoll')";
	try {
		global $db;
		$db->exec($query);
		$disease->id = $db->lastInsertId();
		//echo header("HTTP/1.1 200 OK");
		echo json_encode($disease); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
    
function updateDisease($id) {
    global $app;
    $request = $app->request();
    $disease = json_decode($request->getBody());
    $id = $disease->id;
	$name = $disease->name;
	$infected = $disease->infected;
	$deathtoll = $disease->deathtoll;
    $query= "UPDATE disease SET name = '$name', infected = '$infected', deathtoll = '$deathtoll' WHERE id = '$id'";

    try {
            global $db;
            $db->exec($query);
            echo json_encode($disease); 
    } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function deleteDisease($id){

    $query="DELETE FROM disease WHERE id='$id'";
    echo $query;
    try{
        global $db;
        $db->exec($query);
        echo '<br>Id '.$id.' has been Successfully deleted';
    } catch(PDOException $e){
        echo '{"error":{"text":'.$e->getMessage().'}}';
    }
}  
   
function getDisease($id) {
        $query = "SELECT * FROM disease WHERE id = '$id'";
    try {
        global $db;
        $diseases = $db->query($query);  
        $disease = $diseases->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
                //echo $query; DELETE THIS QUERY TO REMOVE SELECT
        echo json_encode($disease);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
    
function findByName($name) {
    $query = "SELECT * FROM disease WHERE UPPER(name) LIKE ". '"%'.$name.'%"'." ORDER BY name";
    try {
        global $db;
        $diseases = $db->query($query);  
        $disease = $diseases->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($disease);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
?>


