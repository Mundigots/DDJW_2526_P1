import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Variables
	var rankingJug = $('#rankingJug');
	var back = $('#back');

// Funcions
	function obtenirMillorsJug(indx){
		let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
		ranking.sort((a,b) => b.score - a.score);
		return ranking.slice(0,indx);
	}
	
	let top4 = obtenirMillorsJug(4);
	rankingJug.html("");
	
	// Si encara no hi ha puntuacions registrades, es mostra un missatge
	if (top4.length === 0){
		rankingJug.html("<p>Encara no hi ha puntuacions registrades.</p>");
	}
	else{
		// Si hi ha puntuacions guardades llavors llistem el ranking
		top4.forEach((entry,index) => {
			rankingJug.append(`<p>${index+1}. ${entry.alies} - ${entry.score} punts<p>`);
		});
	}

	// TORNAR ENRERE
	back.on('click', function (){
		window.location.assign("./../index.html");
	});
