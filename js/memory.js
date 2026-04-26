const resources = ['../resources/svg/corGr.svg', '../resources/svg/orosGr.svg',
	'../resources/svg/picaBl.svg', '../resources/svg/trevolBl.svg',
	'../resources/svg/corBl.svg', '../resources/svg/orosBl.svg',
	'../resources/svg/picaGr.svg', '../resources/svg/trevolGr.svg'];
const back = '../resources/svg/back.svg';

const StateCard = Object.freeze({
	DISABLE: 0,
	ENABLE: 1,
	DONE: 2
});

var game = {
	alies: sessionStorage.alies || "Unknown",
	items: [],
	states: [],
	setValue: null,
	ready: 0,
	selectedCards: [], // Cartes seleccionades
	remainingGroups: 0, // Grups restants per completar
	isChecking: false, // Variable per bloquejar el gir de les cartes mentre es resol el grup (és correcte o no)
	score: 200,
	level: 1,
	errors: 0,
	numCards: 4,
	difficulty: "easy",
	groupSize: 2, // Les mides dels grups poden ser 2,3 o 4
	timeLimit: 90, // Temps limit inicial
	penalty: 15, // Les penalitzacions per cada error descomptaran 15 punts en el Mode de joc 2
	
	goBack: function(idx){
		this.setValue && this.setValue[idx](back);
		this.states[idx] = StateCard.ENABLE;
	},
	goFront: function(idx){
		this.setValue && this.setValue[idx](this.items[idx]);
		this.states[idx] = StateCard.DISABLE;
	},
	select: function(){
		// Carreguem la partida guardada del Mode 2
		if (sessionStorage.mode2 === "true"){ 
			let toLoad = JSON.parse(sessionStorage.load || "null");
			
			if (toLoad && toLoad.items && toLoad.items.length > 0){ // Evitem un load buit
				this.alies = toLoad.alies || sessionStorage.alies || "Unknown";
				this.items = toLoad.items || [];
				this.states = toLoad.states || [];
				this.selectedCards = toLoad.selectedCards || [];
				this.remainingGroups = toLoad.remainingGroups || 0;
				this.score = toLoad.score;
				this.groupSize = parseInt(toLoad.groupSize) || 2;
				this.numCards = parseInt(toLoad.numCards) || 4;
				this.difficulty = toLoad.difficulty || "easy";
				this.errors = toLoad.errors || 0;
				this.level = parseInt(toLoad.level) || 1;
				this.timeLimit = (toLoad.timeLimit ?? 90);
				this.penalty = (toLoad.penalty ?? 15);
				this.ready = 0;
				this.isChecking = false;
			}
			else{
				// Si no hi ha cap partida guardada en creem una de nova i lle)gim les opcions
				// Netegem load per evitar que es carreguin valors previs a la nova partida
				sessionStorage.removeItem("load");
				sessionStorage.removeItem("currentSaveId");
				
				// Llegim les opcions del Mode 2
				let savedOpt2 = localStorage.optionsModel2 && JSON.parse(localStorage.optionsModel2);
				if (savedOpt2){
					this.level = parseInt(savedOpt2.level) || 1;
					this.difficulty = savedOpt2.difficulty || "easy";
					this.groupSize = parseInt(savedOpt2.groupSize) || 2;
				}
				
				// Nombre de cartes inicials en funció del nivell
				this.numCards = Math.min(4 + Math.floor(this.level/2),12);
				
				// Generació de cartes
				this.items = resources.slice();
				shuffle(this.items);
				this.items = this.items.slice(0, this.numCards);

				let expandedCards = [];
				this.items.forEach(item => {
					for (let i=0; i < this.groupSize; i++){
						expandedCards.push(item);
					}
				});

				this.items = expandedCards;
				shuffle(this.items);

				this.states = new Array(this.items.length).fill(StateCard.ENABLE);
				this.remainingGroups = this.items.length / this.groupSize;
				this.score = 200;
				this.errors = 0;
				this.timeLimit = 90;
				this.penalty = 15;
				this.ready = 0;
				this.isChecking = false;
			}
			
			return; // Realitzem un return per evitar entrar al Mode 1
        }
        // Carreguem la partida guardada del Mode de joc 1
		if (sessionStorage.load){
			let toLoad = JSON.parse(sessionStorage.load || "{}");
			
			this.alies = toLoad.alies || sessionStorage.alies || "Unknown";
			this.items = toLoad.items || [];
			this.states = toLoad.states || [];
			this.selectedCards = toLoad.selectedCards || []; // Carreguem les cartes seleccionades o, si no n'hi ha cap de seleccionada, l'array buit
			this.remainingGroups = toLoad.remainingGroups || 0;
			this.score = toLoad.score;
			this.groupSize = toLoad.groupSize;
			this.numCards = toLoad.numCards;
			this.difficulty = toLoad.difficulty;
			this.errors = toLoad.errors || 0;
			this.level = toLoad.level || 1;
			this.ready = 0;
			this.isChecking = false;
			
			return;
		}

		// Implementem la funcionalitat d'una nova partida del Mode de joc 1
		// Netegem load per evitar que es carreguin valors previs a la nova partida
		sessionStorage.removeItem("load");
		sessionStorage.removeItem("currentSaveId");
		
		let savedOptions = localStorage.optionsModel1 && JSON.parse(localStorage.optionsModel1);
		if (savedOptions){
			this.groupSize = parseInt(savedOptions.groupSize) || 2;
			this.difficulty = savedOptions.difficulty || "normal";
			this.numCards = parseInt(savedOptions.groupCount) || 4;
		}

		// Modificacions en funció de la dificultat
		if (this.difficulty === "easy"){
			this.groupSize = 2;
		}
		else if (this.difficulty === "hard"){
			this.groupSize = Math.max(this.groupSize,3); // El Math.max s'utilitza per assegurar que la mida del grup no baixi mai de 3 ni es redueixi en el cas de que l'usuari hagi seleccionat una dificultat major
		}

		// Selecció de les cartes en funció de numCards
		this.items = resources.slice();
		shuffle(this.items);
		this.items = this.items.slice(0, this.numCards);

		// Expandir segons groupSize
		let expandedItems = [];
		this.items.forEach(item => {
			for (let i=0; i < this.groupSize; i++){
				expandedItems.push(item);
			}
		});

		this.items = expandedItems;          
		shuffle(this.items);

		this.states = new Array(this.items.length).fill(StateCard.ENABLE);
		this.remainingGroups = this.items.length / this.groupSize;
	},
	start: function(){
		this.ready = 0;
        
		this.items.forEach((_,indx)=>{
			if (this.states[indx] === StateCard.DISABLE ||
				this.states[indx] === StateCard.DONE){
				this.ready++;
			}
			else{
				setTimeout(()=>{
					this.ready++;
					this.goBack(indx);
				}, 1000 + 100 * indx);
			}
		});
	},
	calcularPuntuacioMode2: function (){
		let punts = 0;
		punts += this.items.length*2;
		punts += this.groupSize*10;
		punts += this.level*20;
		punts -= this.errors*25;
		return punts;
	},
	guardarPuntuacio: function (){
		let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
		ranking.push({
			alies: this.alies,
			score: this.score,
		});
		
		localStorage.setItem("ranking", JSON.stringify(ranking));
	},
	click: function(indx){
		if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length || this.isChecking) return;

		this.goFront(indx);
		this.selectedCards.push(indx);

		if (this.selectedCards.length === this.groupSize){ // Si s'han seleccionat totes les cartes del grup escollit llavors s'agafa la primera carta clicada i es comprova que la resta siguin iguals
			this.isChecking = true;  // Bloquegem els possibles clics de l'usuari
			
			let firstCard = this.items[this.selectedCards[0]]; // Primera carta clicada
			let equalCardsSelected = this.selectedCards.every(
				i => this.items[i] === firstCard);
			
			// Si totes les cartes són iguals llavors l'estat de la carta passa a "DONE" perquè no es puguin girar de nou
			if (equalCardsSelected){
				this.selectedCards.forEach(
					i => this.states[i] = StateCard.DONE);
				
				// Actualitzem el nombre de grups restants
				this.remainingGroups--;

				// Retornem a l'estat sense cartes seleccionades
                this.selectedCards = [];

				// Permetem al jugador girar les cartes de nou
				this.isChecking = false;

				if (this.remainingGroups <= 0){
					// Progressió dels nivells del Mode de joc 2
					if (sessionStorage.mode2 === "true"){

						this.score += this.calcularPuntuacioMode2();
						this.level++;

						// Progressió de la dificultat del Mode de joc 2
						// Augment del nombre de cartes
						this.numCards = Math.min(4 + Math.floor(this.level/2),12);
						
						// Augment de la mida de grup
						this.groupSize = Math.min(2 + Math.floor(this.level/4),6);
						
						// Reducció del temps disponible
						this.timeLimit = Math.max(90 - this.level*3,20);
						
						// Penalització progressiva en funció del nivell
						this.penalty = 15 + Math.floor(this.level*1.5);
						
						// Reiniciar errors
						this.errors = 0;
						
						sessionStorage.removeItem("load");
						sessionStorage.removeItem("currentSaveId");
						window.location.assign("./game.html");
						return;
					}

					// Resolució partida
					this.guardarPuntuacio();
					sessionStorage.removeItem("currentSaveId");
					sessionStorage.removeItem("load");
					
					alert(`Has guanyat amb ${this.score} punts!!!!`);
					window.location.assign("../");
				}
			}
			else{
				setTimeout(()=>{
					this.selectedCards.forEach(i => this.goBack(i));
					this.selectedCards = [];
					this.isChecking = false;
				},1000);

				this.score -= this.penalty;
				this.errors++;
                
				// Comprovació derrota
				if (this.score <= 0){
					this.guardarPuntuacio();
					sessionStorage.removeItem("currentSaveId");
					sessionStorage.removeItem("load");
					
					alert ("Has perdut");
					window.location.assign("../");
				}
			}
		}
	},
	save: function(){
		let to_save = JSON.stringify({
			alies: this.alies,
			items: this.items,
			states: this.states,
			selectedCards: this.selectedCards,
			remainingGroups: this.remainingGroups,
			score: this.score,
			groupSize: this.groupSize,
			numCards: this.numCards,
			difficulty: this.difficulty,
			errors: this.errors,
			level: this.level,
			timeLimit: this.timeLimit,
			penalty: this.penalty
		});

		let saves = JSON.parse(localStorage.getItem("saves")) || [];
		let partida = JSON.parse(to_save);

		// Afegim informació extra per diferenciar correctament les partides entre si
		partida.id = Date.now();
		partida.nom = `${this.alies} - ${new Date().toLocaleString()}`;
		partida.mode2 = sessionStorage.mode2 === "true";
		
		let currentId = sessionStorage.currentSaveId; // Mantenim les partides identificades
		// Sobreescrivim una partida en cas de que ja existeixi
		if (currentId){
			let index = saves.findIndex(s => s.id == currentId);
			if (index !== -1){
				partida.id = currentId;
				saves[index] = partida;
			}
			else{
				saves.push(partida);
			}
		}
		else{
			saves.push(partida);
		}
		
		localStorage.setItem("saves", JSON.stringify(saves));
		alert("Partida guardada correctament");
		window.location.assign("../");	
	}
}

function shuffle(arr){
	arr.sort(function (){
		return Math.random() - 0.5
	});
}

export var gameItems;
export function selectCards(){ 
	game.select();
	gameItems = game.items;
}

export function clickCard(indx){ 
	game.click(indx); 
}

export function startGame(){ 
	game.start(); 
}

export function initCard(callback){ 
	if (!game.setValue) game.setValue = [];
	game.setValue.push(callback); 
}

export function saveGame(){
	game.save();
}

export{ 
	game 
};
