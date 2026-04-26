import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
		groupSize: 2, // Mida dels grups per defecte
		startLevel: 1
	}; 
	
	// Variables
    var pairs = $('#pairs');
    var difficulty = $('#dif');
	var groupSize = $('#groupSize'); 
    var startLevel = $('#startLevel');
	
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);

	// Assignació de valors en funció de les condicions
    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
	if (savedOptions && savedOptions.groupSize)
		options.groupSize = savedOptions.groupSize;
	if (savedOptions && savedOptions.startLevel)
		options.startLevel = savedOptions.startLevel;

	// Establir valors
    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
	groupSize.val(options.groupSize);
	startLevel.val(options.startLevel);
	
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
	
	startLevel.on('change', function(){
		options.startLevel = startLevel.val();
	});
	
    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
			options.groupSize = default_options.groupSize;
			options.startLevel = default_options.startLevel;
			
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
			groupSize.val(options.groupSize);
			startLevel.val(options.startLevel);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
});

$('#apply').on('click', function(){
	// Únicament guardem les opcions escollides i tornem al menú
	options.applyChanges();
	location.assign("../");
});	
