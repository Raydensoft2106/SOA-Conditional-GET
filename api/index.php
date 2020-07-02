<?php
require 'Slim/Slim.php';
require 'disease_db.php';
require 'database.php';
use \Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();
$app->get('/diseases', 'getDiseases');
$app->get('/diseases/:id',  'getDisease');
$app->get('/diseases/search/:query', 'findByName');
$app->post('/diseases', 'addDisease');
$app->put('/diseases/:id','updateDisease');
$app->delete('/diseases/:id','deleteDisease');
$app->run();
?>
