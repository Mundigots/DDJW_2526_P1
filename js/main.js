import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Obtenir elements
	var seleccionarPlay = $('#play');
	var seleccionarOptions = $('#options');
	var seleccionarSaves = $('#saves');
	var seleccionarExit = $('#exit');
	var seleccionarRanking = $('#ranking');
	var seleccionarAlies = $('#canviarAlies');

// Detectar canvis
	// PLAY (mostra la selecció del mode de joc)
	seleccionarPlay.on('click', function (){
		window.location.assign("./html/selectPlayMode.html");
	});
	
	// OPTIONS
	seleccionarOptions.on('click', function (){
		window.location.assign("./html/options.html");
	});
	
	// LOAD PREVIOUS SAVES
	seleccionarSaves.on('click', function (){
		window.location.assign("./html/saves.html");
	});
	
	// RANKING
	seleccionarRanking.on('click', function (){
		window.location.assign("./html/ranking.html");
	});
	
	// CANVIAR ALIES
	seleccionarAlies.on('click', function (){
		sessionStorage.removeItem("alies");
		location.reload();
	});
	
	// EXIT
	seleccionarExit.on('click', function (){
		console.warn("No es pot sortir!");
	});