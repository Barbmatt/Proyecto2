// -----------------------funciones de cámara---------------------------------

function reset_camara() {
	camara.r = 90;
	camara.t = 60*Math.PI/180;
	camara.f = 40*Math.PI/180;
}

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
function direccionx(luz, id) { luz.direccion[0] = document.getElementById(id).value; }

function direcciony(luz, id) { luz.direccion[1] = document.getElementById(id).value; }

function direccionz(luz, id) { luz.direccion[2] = document.getElementById(id).value; }


// funciones de intensidad de luces.
function intensidadr(luz, id, tipo_luz) {
	let valor = document.getElementById(id).value;
	if ( tipo_luz == 0 ) ispot[0] = valor;
	else if ( tipo_luz == 1 ) ipuntual[0] = valor;
	else idireccional[0] = valor;
	luz.intensidad[0] = valor;
}

function intensidadg(luz, id, tipo_luz) {
	let valor = document.getElementById(id).value;
	if ( tipo_luz == 0 ) ispot[1] = valor;
	else if ( tipo_luz == 1 ) ipuntual[1] = valor;
	else idireccional[1] = valor;
	luz.intensidad[1] = valor;
}

function intensidadb(luz, id, tipo_luz) {
	let valor = document.getElementById(id).value;
	if ( tipo_luz == 0 ) ispot[2] = valor;
	else if ( tipo_luz == 1 ) ipuntual[2] = valor;
	else idireccional[2] = valor;
	luz.intensidad[2] = valor;
}

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

function toggle(luz, id, tipo_luz) {
	let dibujar = luz.dibujar;
	if ( dibujar ) luz.intensidad = [0,0,0];
	if ( tipo_luz == 0 ) {
		if ( !dibujar ) luz.intensidad = [ispot[0], ispot[1], ispot[2]];
		document.getElementById("intensidad_spotr").disabled = dibujar;
		document.getElementById("intensidad_spotg").disabled = dibujar;
		document.getElementById("intensidad_spotb").disabled = dibujar;
	}
	else if ( tipo_luz == 1 ) {
		if ( !dibujar ) luz.intensidad = [ipuntual[0], ipuntual[1], ipuntual[2]];
		document.getElementById("intensidad_puntualr").disabled = dibujar;
		document.getElementById("intensidad_puntualg").disabled = dibujar;
		document.getElementById("intensidad_puntualb").disabled = dibujar;
	}
	else {
		if ( !dibujar ) luz.intensidad = [idireccional[0], idireccional[1], idireccional[2]];
		document.getElementById("intensidad_direccionalr").disabled = dibujar;
		document.getElementById("intensidad_direccionalg").disabled = dibujar;
		document.getElementById("intensidad_direccionalb").disabled = dibujar;
	}
	luz.dibujar = !dibujar;
	document.getElementById(id).innerText = dibujar ? "Off" : "On";
}

function iniciar_luces() {
	// se setean las luces (spot, puntual, direccional y ambiente)

	luz_spot = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	luz_puntual = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	luz_direccional = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	ispot = [0,0,0], ipuntual = [0,0,0], idireccional = [0,0,0];
	luz_ambiente = [1,1,1];

	posicionx(luz_spot, "pos_spotx");
	posiciony(luz_spot, "pos_spoty");
	posicionz(luz_spot, "pos_spotz");
	direccionx(luz_spot, "dir_spotx");
	direcciony(luz_spot, "dir_spoty");
	direccionz(luz_spot, "dir_spotz");
	intensidadr(luz_spot, "intensidad_spotr", 0);
	intensidadg(luz_spot, "intensidad_spotg", 0);
	intensidadb(luz_spot, "intensidad_spotb", 0);
	angulo(luz_spot);
	atenuaciona(luz_spot,"atenuacion_spota");
	atenuacionb(luz_spot,"atenuacion_spotb");
	atenuacionc(luz_spot,"atenuacion_spotc");

	posicionx(luz_puntual, "pos_puntualx");
	posiciony(luz_puntual, "pos_puntualy");
	posicionz(luz_puntual, "pos_puntualz");
	intensidadr(luz_puntual, "intensidad_puntualr", 1);
	intensidadg(luz_puntual, "intensidad_puntualg", 1);
	intensidadb(luz_puntual, "intensidad_puntualb", 1);
	atenuaciona(luz_puntual,"atenuacion_puntuala");
	atenuacionb(luz_puntual,"atenuacion_puntualb");
	atenuacionc(luz_puntual,"atenuacion_puntualc");


	direccionx(luz_direccional, "dir_direccionalx");
	direcciony(luz_direccional, "dir_direccionaly");
	direccionz(luz_direccional, "dir_direccionalz");
	intensidadr(luz_direccional, "intensidad_direccionalr", 2);
	intensidadg(luz_direccional, "intensidad_direccionalg", 2);
	intensidadb(luz_direccional, "intensidad_direccionalb", 2);
	intensidad_ambienter("intensidad_ambienter");
	intensidad_ambienteg("intensidad_ambienteg");
	intensidad_ambienteb("intensidad_ambienteb");
}
