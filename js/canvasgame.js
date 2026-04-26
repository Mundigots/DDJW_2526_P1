import {$} from "../library/jquery-4.0.0.slim.module.min.js";

// Importem la lògica del joc des del fitxer memory.js
import { game, selectCards, clickCard, startGame as startLogic, saveGame } from "../js/memory.js";

// INICIALITZACIÓ DEL DOM (sense jQuery)

// Esperem que el DOM estigui carregat abans de treballar amb elements HTML
document.addEventListener("DOMContentLoaded", () =>{
	// Assignem funcionalitat al botó de guardar partida
	const saveBtn = document.getElementById("save");
	if (saveBtn){
		saveBtn.addEventListener("click", () =>{
			saveGame();
		});
	}

	// Un cop el DOM està llest, inicialitzem el joc
	init();
});


// Configuració del canvas
// Obtenim el canvas i el seu context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Millorem la qualitat del renderitzat
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";


// Gestió dels recursos

const back = "../resources/svg/back.svg";
const cache = new Map();

// Càrrega dels recursos i la seva gestió per evitar tornar-los a carregar si ja existeixen
function loadImg(src){
	if (cache.has(src)){
		return cache.get(src);
	}
    
	const img = new Image();
	img.src = src;

	// Quan la imatge es carrega, redibuixem el canvas
	img.onload = () => drawAll();

	cache.set(src,img);
	return img;
}


// Càlcul de les posicions de les cartes
let positions = [];

// Calculem quantes files i columnes són necessaries
function computeGrid(total){
	let cols = Math.ceil(Math.sqrt(total));
	let rows = Math.ceil(total / cols);

	while (rows * cols >= total + cols){
		rows--;
	}
	
	return{ 
		cols, 
		rows 
	};
}

// Es genera la posició i mida de cada carta
function generatePositions(){
	const total = game?.items?.length || 0;
	if (!total){
		return;
	}
	
	const {cols, rows} = computeGrid(total);

	const marginX = 40;
	const marginY = 60;

	const availW = canvas.width - marginX*2;
	const availH = canvas.height - marginY*2;

	let w = availW / cols;
	let h = w * 1.5;

	if (h > availH / rows){
		h = availH / rows;
		w = h / 1.5;
	}

	const offsetX = (canvas.width - cols*w)/2;
	const offsetY = (canvas.height - rows*h)/2;

	positions = [];

	for (let i = 0; i < total; i++){
		const r = Math.floor(i/cols);
		const c = i % cols;

		positions.push({
			x: offsetX + c*w,
			y: offsetY + r*h,
			w,
			h
		});
	}
}

// HUD (informació que es mostrarà a la pantalla de joc)
function drawHUD(){
	ctx.save();
	ctx.fillStyle = "#173B64";
	ctx.font = "20px Serif";
	ctx.textAlign = "left";
		
	ctx.fillText(`Punts: ${game.score}    Nivell: ${game.level}    Errors: ${game.errors}`, 20, 30);

	if (sessionStorage.getItem("mode2") === "true"){
		ctx.textAlign = "right";
		ctx.fillText(`Temps: ${game.timeLimit}s   Grups: ${game.remainingGroups}`, canvas.width - 20, 30);
	}

	ctx.restore();
}


// Dibuix de les cartes
function drawCard(i){
	const p = positions[i];
	if (!p){
		return;
	}
	
	const state = game.states[i];
	const imgFront = loadImg(game.items[i]);
	const imgBack = loadImg(back);

	ctx.save();

	// Definim la zona que ocupa la carta
	ctx.beginPath();
	ctx.rect(p.x, p.y, p.w, p.h);
	ctx.clip();

	// Mostrem cara o dors segons l'estat
	if (state === 0 || state === 2){
		ctx.drawImage(imgFront, p.x, p.y, p.w, p.h);

	} 
	else {
		ctx.drawImage(imgBack, p.x, p.y, p.w, p.h);
	}

	ctx.restore();
}

// Dibuix de l'entorn de joc
function drawAll(){
	ctx.fillStyle = "#A3C4EB";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawHUD();

	for (let i = 0; i < game.items.length; i++){
		drawCard(i);
	}
}


// Gestió dels clics
canvas.addEventListener("click", function(e){
	const rect = canvas.getBoundingClientRect();

	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	for (let i = 0; i < positions.length; i++){
		const p = positions[i];

		if (x >= p.x && x <= p.x + p.w &&
			y >= p.y && y <= p.y + p.h){

			clickCard(i);
			break;
		}
	}
});


// Inicialització del joc
async function init(){
	await selectCards(); // per si és async
	generatePositions();
	startLogic();
	requestAnimationFrame(loop);
}

function loop(){
	drawAll();
	requestAnimationFrame(loop);
}