import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Variables
	var saveList = $('#saveList');
	var back = $('#back');
	
// Obtenir partides
	let saves = JSON.parse(localStorage.getItem("saves")) || [];

// Tornar
	back.on('click', function (){
		window.location.assign("./../index.html");
	});

// Gestió de les partides guardades
	if (saves.length === 0){
		$('#saveList').append(`<li>No hi ha partides guardades</li>`);
	}
	else{
		saves.forEach((save) => {
		let saveItem = $(`
			<li>
				${save.nom}
				<button class="loadBtn">Carregar</button>
				<button class="deleteBtn">Eliminar</button>
			</li>
		`);

		// Carregar partida
		saveItem.find('.loadBtn').on('click', function (){
			sessionStorage.load = JSON.stringify(save);
			sessionStorage.currentSaveId = save.id;
			sessionStorage.mode2 = save.mode2;

			window.location.assign("./game.html");
		});

		// Eliminar partida
		saveItem.find('.deleteBtn').on('click', function (){
			let newSaves = saves.filter(s => s.id !== save.id);
			localStorage.setItem(
				"saves",	
				JSON.stringify(newSaves)
			);

			location.reload();
		});

		$('#saveList').append(saveItem);
	});
}