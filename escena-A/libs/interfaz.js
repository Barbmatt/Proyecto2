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




// funciones de dirección de luces.
function direccionx(luz, id, tipo_luz) { luz.direccion[0] = document.getElementById(id).value; }

function direcciony(luz, id, tipo_luz) { luz.direccion[1] = document.getElementById(id).value; }

function direccionz(luz, id, tipo_luz) { luz.direccion[2] = document.getElementById(id).value; }




// funciones de intensidad de luces.
function intensidadr(luz, id) { luz.intensidad[0] = document.getElementById(id).value; }

function intensidadg(luz, id) { luz.intensidad[1] = document.getElementById(id).value; }

function intensidadb(luz, id) { luz.intensidad[2] = document.getElementById(id).value; }



function angulo(luz) { luz.angulo = document.getElementById("angulo").value; }


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

function toggle(luz,id) {
	let dibujar = luz.dibujar;
	luz.dibujar = !dibujar;
	document.getElementById(id).innerText = dibujar ? "Off" : "On";
}

function iniciar_luces() {
	// se setean las luces (spot, puntual, direccional y ambiente)

	luz_spot = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	luz_puntual = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	luz_direccional = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	luz_ambiente = [1,1,1];

	posicionx(luz_spot, "pos_spotx");
	posiciony(luz_spot, "pos_spoty");
	posicionz(luz_spot, "pos_spotz");
	direccionx(luz_spot, "dir_spotx");
	direcciony(luz_spot, "dir_spoty");
	direccionz(luz_spot, "dir_spotz");
	intensidadr(luz_spot, "intensidad_spotr");
	intensidadg(luz_spot, "intensidad_spotg");
	intensidadb(luz_spot, "intensidad_spotb");
	angulo(luz_spot);
	atenuaciona(luz_spot,"atenuacion_spota");
	atenuacionb(luz_spot,"atenuacion_spotb");
	atenuacionc(luz_spot,"atenuacion_spotc");

	posicionx(luz_puntual, "pos_puntualx");
	posiciony(luz_puntual, "pos_puntualy");
	posicionz(luz_puntual, "pos_puntualz");
	intensidadr(luz_puntual, "intensidad_puntualr");
	intensidadg(luz_puntual, "intensidad_puntualg");
	intensidadb(luz_puntual, "intensidad_puntualb");
	atenuaciona(luz_puntual,"atenuacion_puntuala");
	atenuacionb(luz_puntual,"atenuacion_puntualb");
	atenuacionc(luz_puntual,"atenuacion_puntualc");


	direccionx(luz_direccional, "dir_direccionalx");
	direcciony(luz_direccional, "dir_direccionaly");
	direccionz(luz_direccional, "dir_direccionalz");
	intensidadr(luz_direccional, "intensidad_direccionalr");
	intensidadg(luz_direccional, "intensidad_direccionalg");
	intensidadb(luz_direccional, "intensidad_direccionalb");

	intensidad_ambienter("intensidad_ambienter");
	intensidad_ambienteg("intensidad_ambienteg");
	intensidad_ambienteb("intensidad_ambienteb");

}
