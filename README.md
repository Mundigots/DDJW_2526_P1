MEMORY BASAT EN JAVASCRIPT I CANVAS
1. Introducció
Aquest treball es basa en el desenvolupament d'un memory utilitzant principalment JavaScript i Canvas, partint de la base implementada a classes.
L’objectiu principal del projecte no ha estat cap altre que ampliar el codi base, afegint noves funcionalitats tant a nivell de disseny com de programació.
A part, d'utilitzar i familiaritzar-se amb GitHub (merges, ús de les branques, tractament d'issues i commits).

A nivell del joc, consisteix en seleccionar els grups de cartes iguals (parelles, trios o quartets) dins del conjunt de cartes disposades que es mostren per pantalla. 

2. Descripció del disseny del joc

El joc s’ha dissenyat en funció dels requisits esmentats en el document de pauta rebut, és per això que es tenen en compte els diferents paràmetres configurables
per part de l'usuari i que permeten adaptar tant la dificultat com la dinàmica de cada partida.

Per aconseguir-ho, s’han definit conceptes com la mida de cada grup (ampliant les combinacions a encertar de dos fins a 4). Un factor que afecta directament a la dificultat 
del joc.

I, en relació a la dificultat de joc, s'han implementat dos modes de joc:

- Mode 1 (nivell únic)
En aquest mode, l’usuari pot escollir el nombre de cartes, la dificultat i la mida dels grups que desitja a la partida.

- Mode 2 (progressiu)
El joc, basat ara en una progressió dels nivells, augmenta automàticament la dificultat a mesura que aquests se superen.
Aquesta progressió es basa en:
  - Increment del nombre de cartes (fins a un llindar que s'ha definit per no saturar la consola i sobretot, fer-lo jugable a una escala realista)
  - Augment de la mida dels grups (no limitat a quartets)
  - Reducció del temps disponible
  - Increment de les penalitzacions

Així mateix, en aquest mode s’ha implementat un sistema de puntuació propi i acumulatiu en la succeció de nivells. 

Els resultats, es mostren en un rànquing que guarda elsquatre millors resultats dels jugadors, que s'han d'identificar mitjançant un àlies que podran modificar en qualsevol
moment en el menú principal.

3. Descripció de les parts més rellevants de la implementació

La implementació del joc separa la lògica del joc (memory.js) de la representació gràfica utilitzant Canvas.
La gestió de l’estat del joc es basa en l’objecte game, que centralitza tota la informació de la partida mitjançant paràmetres com:
  - cartes (items)
  - estats (states)
  - puntuació (score)
  - nivell (level)
  - errors
  - mida de grup (groupSize)

A part, també gestiona el flux del joc. En ell trobem inclosos; la selecció de cartes, la comprovació de grups i la progressió de nivells.

El sistema de selecció i comprovació és un punt rellevant pel fet que, quan l’usuari selecciona cartes:
- s'han de guarden a selectedCards
- comprovar que totes siguin iguals quan s'arriba a la mida del grup definida
- marcar com a completats els grups complets
- aplicar una penalització en cas de no ser correcte (mode de joc 2) i girar-les de nou
- utilitzar la variable isChecking per evitar interaccions mentre es resol un grup

Generació dinàmica de cartes
Les cartes es generen a partir d’un conjunt de recursos definits i es barregen per, posteriorment, seleccionar-ne un subconjunt en funció del nombre de cartes,
que es dupliquen segons la mida del grup i es tornen a barrejar per donar-li una mica més de dificultat i disposar-les aleatòriament.

Implementació amb Canvas
És al Canvas on es dibuixen les cartes segons el seu estat (cara o dors), es calculen dinàmicament les posicions en forma de graella i es mostra un HUD 
extremadament bàsic amb informació de la partida (punts, nivell i errors).

Sistema de guardat i càrrega
El sistema de guardat així com el de càrrega es basa en localStorage i sessionStorage:

- Guardar partida: es guarda amb un identificador únic que permet sobreescriure partides existents
- Carregar partida: recupera l’estat complet i restaura la partida exactament en el punt en què es va deixar

Aquest sistema funciona per als dos modes de joc.

Rànking de puntuacions
El rànking de puntuacions guarda les puntuacions a localStorage, associades a l’àlies entrat pel jugador.

4. Conclusions i problemes trobats
Durant el desenvolupament del projecte s’han trobat diversos reptes i errors a afrontar, tant a nivell tècnic com a nivell conceptual.
Un dels principals problemes ha estat la creació de les cartes al Canvas i la implementació progressiva del mode de joc 2.

La conclusió extreta en relació a aquest treball, és que ha permès aprofundir en la programació de JavaScript utilitzant moduls, jQuery, 
manipular el Canvas i gestionar l’estat dels elements en aplicacions interactives.



l’organització d’un projecte real amb GitHub

El resultat és un joc funcional, ampliable i amb una estructura clara.
