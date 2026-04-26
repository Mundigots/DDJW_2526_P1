import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Variables
	var seleccionarMode1 = $('#opMode1');
	var seleccionarMode2 = $('#opMode2');
	var back = $('#back');
	
// Detectar canvis
	seleccionarMode1.on('click', function (){
		window.location.assign("../html/optionsMode1.html");
	});
	
	seleccionarMode2.on('click', function (){
		window.location.assign("../html/optionsMode2.html");
	});
	
	back.on('click', function (){
		window.location.assign("./../index.html");
	});