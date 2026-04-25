import {$} from "../library/jquery-4.0.0.slim.module.min.js";

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
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
