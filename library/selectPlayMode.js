import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Variables
	var mode1 = $('#mode1');
	var mode2 = $('#mode2');
	var backMenu = $('#backMenu');

// MODE DE JOC 1
	mode1.on('click', function (){
		sessionStorage.removeItem("mode2");
		sessionStorage.removeItem("load");
		window.location.assign("./html/game.html");
	});
	
	// MODE DE JOC 2
	mode2.on('click', function (){
		const op = JSON.parse(localStorage.options || "{}");
		sessionStorage.mode2 = "true";
		
		// Només guardem el nivell inicial i els paràmetres per defecte
		sessionStorage.load = JSON.stringify({
			items: [],
			states: [],
			selectedCards: [],
			remainingGroups: 0,
			score: 200,
			groupSize: parseInt(op.groupSize) || 2,
			numCards: parseInt(op.numCards) || 4,
			difficulty: op.difficulty || "easy",
			errors: 0,
			level: parseInt(op.startLevel) || 1,
			timeLimit: 90,
			penalty: 15
		});
		
		window.location.assign("./game.html");
	});
	
// TORNAR ENRERE
	backMenu.on('click', function (){
		window.location.assign("../index.html");
	});