import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(function (){
	// Variables
	var alies = $('#alies');

	alies.html(`
		<div id="aliesOverlay">
			<div id="aliesBox">
				<h2>Introdueix el teu àlies</h2>
				<input id="aliesInput" type="text" placeholder="Àlies">
				<button id="aliesConfirm">Continuar</button>
			</div>
		</div>
	`);
	
	if (!sessionStorage.alies){
		// Variables
		var aliesOverlay = $("#aliesOverlay");
		var aliesConfirm = $("#aliesConfirm");
		
		aliesOverlay.css("display","flex");
		aliesConfirm.on("click", function (){
			let value = $("#aliesInput").val().trim();
			
			if (value === ""){ // Si l'usuari entra un àlies buit es sol·licita de nou
				alert("Has d'introduir un àlies");
				return;
			}
			
			sessionStorage.alies = value;
			aliesOverlay.css("display","none");
		});
	}
});
