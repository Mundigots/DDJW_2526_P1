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
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selectedCards: [], // Cartes seleccionades
	remainingGroups: 0, // Grups restants per completar
    isChecking: false, // Variable per bloquejar el gir de les cartes mentre es resol el grup (és correcte o no)
	score: 200,
    groupSize: 2, // Les mides dels grups poden ser 2,3 o 4
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selectedCards = toLoad.selectedCards || []; // Carreguem les cartes seleccionades o, si no n'hi ha cap de seleccionada, l'array buit
            this.remainingGroups = toLoad.remainingGroups;
			this.isChecking = false;
			this.score = toLoad.score;
            this.groupSize = toLoad.groupSize;
        }
        else{ // Nova partida
			// Llegim les opcions guardades
			let savedOptions = localStorage.options && JSON.parse(localStorage.options);
            
			if (savedOptions){
				this.groupSize = parseInt(savedOptions.groupSize) || 2;
				this.difficulty = savedOptions.difficulty || "normal";
				this.numCards = parseInt(savedOptions.pairs) || 4;
			}
			
			// Modificacions en funció de la mida del grup
			if (this.difficulty === "easy"){
				this.groupSize = 2;
			}
			else if (this.difficulty === "hard"){
				this.groupSize = Math.max(this.groupSize, 3); // El Math.max s'utilitza per assegurar que la mida del grup no baixi mai de 3 ni es redueixi en el cas de que l'usuari hagi seleccionat una dificultat major
			}
			
			// Selecció de les cartes en funció de numCards
			this.items = resources.slice();
			shuffe(this.items);
			this.items = this.items.slice(0, this.numCards);
			
			// Expandir segons groupSize
			let expandedItems = [];
			this.items.forEach(item => {
				for (let i=0; i < this.groupSize; i++){
					expandedItems.push(item);
				}
			});
			
			this.items = expandedItems;          
            shuffe(this.items);
			
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
			this.remainingGroups = this.items.length / this.groupSize;
        }
    },
    start: function(){
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
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length || this.isChecking) return;
        
		this.goFront(indx);
		this.selectedCards.push(indx);
		
		// Si s'han seleccionat totes les cartes del grup escollit llavors s'agafa la primera carta clicada i es comprova que la resta siguin iguals
        if (this.selectedCards.length === this.groupSize){
			this.isChecking = true; // Bloquegem els possibles clics de l'usuari
			
			let firstCard = this.items[this.selectedCards[0]]; // Primera carta clicada
			let equalCardsSelected = this.selectedCards.every(
				i => this.items[i] === firstCard);
			
			// Si totes les cartes són iguals llavors l'estat de la carta passa a "DONE" perquè no es puguin girar de nou
			if (equalCardsSelected){
				this.selectedCards.forEach(
					i=>this.states[i] = StateCard.DONE);
				
				// Actualitzem el nombre de grups restants
				this.remainingGroups--;
				
				// Retornem a l'estat sense cartes seleccionades
				this.selectedCards = [];
				
				// Permetem al jugador girar les cartes de nou
				this.isChecking = false;
				
				// Comprovació de victòria
				if (this.remainingGroups <= 0){
					alert(`Has guanyat amb ${this.score} punts!!!!`);
					window.location.assign("../");
				}
			}
			else{ // Grup incorrecte
				setTimeout(()=>{ // Retornem les cartes al seu estat previ a ser girades
					this.selectedCards.forEach(i => this.goBack(i));
					this.selectedCards = [];
					this.isChecking = false;
				},1000);
				
				// Actualitzem puntuació
				this.score -= 25;
				
				// Comprovem derrota
                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
				}
            }
        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            selectedCards: this.selectedCards,
			remainingGroups: this.remainingGroups,
            score: this.score,
            groupSize: this.groupSize
        });
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}

export function clickCard(indx){ 
	game.click(indx); 
}

export function startGame(){ 
	game.start(); 
}

export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}

// Funcions no utilitzades en la implementació de memory.js

/*
function goBack(idx){
    setValue(idx, back);
    clickOn(idx);
}

function goFront(idx){
    setValue(idx, items[idx]);
    clickOff(idx);
}
*/

export function saveGame(){
    game.save();
}