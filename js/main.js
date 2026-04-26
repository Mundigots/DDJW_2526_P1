import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Obtenir elements
	var seleccionarPlay = $('#play');
	var seleccionarOptions = $('#options');
	var seleccionarSaves = $('#saves');
	var seleccionarExit = $('#exit');
	
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
		let toLoad = localStorage.save;
		
		fetch('../php/load.php', {
			method: "POST",
			body: JSON.stringify({}),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})
		
		.then(response => response.json())
		.then(json => {
			if (!json.error){
				toLoad = JSON.stringify(json.save);
			}
		})
		.catch(err => {
			console.error(err);
			console.warn("La partida s'intentarà carregar de local");
		})
		.finally(() => {
			if (!toLoad){
				alert("No hi ha cap partida a carregar");
				return;
			}
			sessionStorage.load = toLoad;
			window.location.assign("./html/game.html");
		});
	});
	
	// EXIT
	seleccionarExit.on('click', function (){
		console.warn("No es pot sortir!");
	});