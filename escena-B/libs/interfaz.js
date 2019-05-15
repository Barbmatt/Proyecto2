// -----------------------funciones de cámara---------------------------------

function reset_camara() { camara.reset(); }

function toggle_camara() {
	let select = document.getElementById("camara_seleccionada");
	if ( select.value == 1 ) select.value = 0;
	else select.value = 1;
}



// ---------------------------funciones de luz--------------------------------

// funciones de posición de luces.
function posicionx(luz, id) { luz.posicion[0] = document.getElementById(id).value; }

function posiciony(luz, id) { luz.posicion[1] = document.getElementById(id).value; }

function posicionz(luz, id) { luz.posicion[2] = document.getElementById(id).value; }



// funciones de intensidad de luces.
function intensidadr(luz, id) { luz.intensidad[0] = document.getElementById(id).value; }

function intensidadg(luz, id) { luz.intensidad[1] = document.getElementById(id).value; }

function intensidadb(luz, id) { luz.intensidad[2] = document.getElementById(id).value; }



// atenuacion
function atenuaciona(luz,id) {
	let fa = document.getElementById(id).value;
	if ( !isNaN(fa) ) luz.atenuacion[0] = fa;
}

function atenuacionb(luz,id) {
	let fb = document.getElementById(id).value;
	if ( !isNaN(fb) ) luz.atenuacion[1] = fb;
}

function atenuacionc(luz,id) {
	let fc = document.getElementById(id).value;
	if ( !isNaN(fc) ) luz.atenuacion[2] = fc;
}

function intensidad_ambienter(id) { luz_ambiente[0] = document.getElementById(id).value; }

function intensidad_ambienteg(id) { luz_ambiente[1] = document.getElementById(id).value; }

function intensidad_ambienteb(id) { luz_ambiente[2] = document.getElementById(id).value; }

function iniciar_luces() {
	// se setean las luces (spot, puntual, direccional y ambiente)

	luz_puntual = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	luz_ambiente = [0,0,0];

	posicionx(luz_puntual, "pos_puntualx");
	posiciony(luz_puntual, "pos_puntualy");
	posicionz(luz_puntual, "pos_puntualz");
	intensidadr(luz_puntual, "intensidad_puntualr");
	intensidadg(luz_puntual, "intensidad_puntualg");
	intensidadb(luz_puntual, "intensidad_puntualb");
	atenuaciona(luz_puntual,"atenuacion_puntuala");
	atenuacionb(luz_puntual,"atenuacion_puntualb");
	atenuacionc(luz_puntual,"atenuacion_puntualc");

	intensidad_ambienter("intensidad_ambienter");
	intensidad_ambienteg("intensidad_ambienteg");
	intensidad_ambienteb("intensidad_ambienteb");

}

//Funcion on/off luz puntual
function toggle(luz,id) {
	let dibujar = luz.dibujar;
	luz.dibujar = !dibujar;
	document.getElementById(id).innerText = dibujar ? "Off" : "On";
}
