addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        var alias = prompt("Quin nom tens?");
		console.log(alias);
		alert("Benvingut " + alias + "!");
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});