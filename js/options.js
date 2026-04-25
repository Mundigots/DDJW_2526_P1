import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var modeJoc = $('#modeJoc');
var opcionsMode1 = $('#opcionsMode1');

var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
		groupSize: 2 // Mida dels grups per defecte
    } 
	
	// Variables
    var pairs = $('#pairs');
    var difficulty = $('#dif');
	var groupSize = $('#groupSize'); 
    
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);
	
	// Mostrar o amagar les opcions en funció del mode
	modeJoc.on('change', function (){
		if (modeJoc.val() === "mode1"){
			opcionsMode1.show();
		} 
		else {
			opcionsMode1.hide();
		}
	});

	// Estat inicial del joc
	if (modeJoc.val() === "mode2"){
		opcionsMode1.hide();
	}

	// Assignació de valors en funció de les condicions
    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
	if (savedOptions && savedOptions.groupSize)
		options.groupSize = savedOptions.groupSize;
	
	// Establir valors
    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
	groupSize.val(options.groupSize);
	
	// Guardar canvis
    pairs.on('change', function (){
        options.pairs = pairs.val();
    });

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });
	
	groupSize.on('change', function (){
		options.groupSize = groupSize.val();
	});
	
    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
			options.groupSize = default_options.groupSize;
			
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
			groupSize.val(options.groupSize);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
});

$('#apply').on('click', function(){
    if (modeJoc.val() === "mode1"){
		// Únicament guardem les opcions escollides i tornem al menú
		options.applyChanges();
		location.assign("../");
	}
	else{
		// En el mode 2 de joc cal carregar la partida guardada en el cas de que n'hi hagi
		if (localStorage.save){
			sessionStorage.load = localStorage.save;
			location.assign("../html/game.html");
		}
		else{
			// Si no hi ha partides prèvies guardades, mostrem un missatge per pantalla
			alert("No hi ha cap partida guardada. Comença una partida nova amb el Mode 1");
		}
	}
});	
