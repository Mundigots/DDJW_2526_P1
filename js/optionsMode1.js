import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var optionsModel1 = function(){
    const default_options = {
        groupCount: 2,
        difficulty: 'normal',
		groupSize: 2, // Mida dels grups per defecte
	}; 
	
	// Variables
    var groupCount = $('#groupCount');
    var difficulty = $('#dif');
	var groupSize = $('#groupSize'); 
	
	// Es carreguen les opcions guardades
    var savedOptions = localStorage.optionsModel1 && JSON.parse(localStorage.optionsModel1);
    var opts = Object.assign({}, default_options);

	// Assignació de valors en funció de les condicions
    if (savedOptions && savedOptions.groupCount)
        opts.groupCount = String(savedOptions.groupCount);
    if (savedOptions && savedOptions.difficulty)
        opts.difficulty = savedOptions.difficulty;
	if (savedOptions && savedOptions.groupSize)
		opts.groupSize = savedOptions.groupSize;

	// Establir valors
    groupCount.val(opts.groupCount);
    difficulty.val(opts.difficulty);
	groupSize.val(String(opts.groupSize));
	
	// Guardar canvis
    groupCount.on('change', function (){
        opts.groupCount = groupCount.val();
    });

    difficulty.on('change', function (){
        opts.difficulty = difficulty.val();
    });
	
	groupSize.on('change', function (){
		opts.groupSize = groupSize.val();
	});
	
    return {
        applyChanges: function(){
            localStorage.optionsModel1 = JSON.stringify(opts);
        },
        defaultValues: function(){
            opts.groupCount = default_options.groupCount;
            opts.difficulty = default_options.difficulty;
			opts.groupSize = default_options.groupSize;
			
            groupCount.val(opts.groupCount);
            difficulty.val(opts.difficulty);
			groupSize.val(opts.groupSize);
        }
    }
}();

$('#default').on('click', function(){
    optionsModel1.defaultValues();
});

$('#apply').on('click', function(){
	// Únicament guardem les opcions escollides i tornem al menú
	optionsModel1.applyChanges();
	sessionStorage.mode2 = "false";
	sessionStorage.removeItem("load");
	location.assign("./canvasgame.html");
});	
