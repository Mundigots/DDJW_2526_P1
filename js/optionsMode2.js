import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var optionsModel2 = function(){
	// Paràmetres per defecte
	const default_options = {
        level: 1,
        difficulty: 'easy',
		groupSize: 2, // Mida dels grups per defecte
	}; 
	
	// Variables
	var level = $('#level');
	var difficulty = $('#difficulty');
	var groupSize = $('#groupSize');
	
	// Es carreguen les opcions guardades
    var savedOptions = localStorage.optionsModel2 && JSON.parse(localStorage.optionsModel2);
    var opts = Object.assign({}, default_options);
	
	// Assignació de valors en funció de les condicions
    if (savedOptions && savedOptions.level)
        opts.level = parseInt(savedOptions.level);
    if (savedOptions && savedOptions.difficulty)
        opts.difficulty = savedOptions.difficulty;
	if (savedOptions && savedOptions.groupSize)
		opts.groupSize = parseInt(savedOptions.groupSize);

	// Establir valors
    level.val(opts.level);
    difficulty.val(opts.difficulty);
	groupSize.val(opts.groupSize);
	
	// Guardar canvis
    level.on('change', function (){
        opts.level = level.val();
    });

    difficulty.on('change', function (){
        opts.difficulty = difficulty.val();
    });
	
	groupSize.on('change', function (){
		opts.groupSize = groupSize.val();
	});
	
    return {
        applyChanges: function(){
            localStorage.optionsModel2 = JSON.stringify(opts);
        },
        defaultValues: function(){
            opts.level = default_options.level;
            opts.difficulty = default_options.difficulty;
			opts.groupSize = default_options.groupSize;
			
            level.val(opts.level);
            difficulty.val(opts.difficulty);
			groupSize.val(opts.groupSize);
        }
    }
}();

$('#default').on('click', function(){
    optionsModel2.defaultValues();
});

$('#apply').on('click', function(){
	// Únicament guardem les opcions escollides i tornem al menú
	optionsModel2.applyChanges();
	
	// Esborrem qualsevol possible partida prèvia
	sessionStorage.removeItem("load");
	sessionStorage.removeItem("mode2");
	
	// Activem el Mode de joc 2
	sessionStorage.mode2 = "true";
	location.assign("./game.html");
});	
