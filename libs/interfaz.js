// -----------------------funciones de cámara---------------------------------

function reset_camara() { camara.reset(); }

function toggle_camara() { 
	let select = document.getElementById("camara_seleccionada");
	if ( select.value == 1 ) select.value = 0;
	else select.value = 1;
}



// ---------------------------funciones de luz--------------------------------

// funciones de posición de luces.
function posicionx(luz, id) {
	let px = document.getElementById(id).value;
	luz.posicion[0] = px;
}

function posiciony(luz, id) {
	let py = document.getElementById(id).value;
	luz.posicion[1] = py;
}

function posicionz(luz, id) {
	let pz = document.getElementById(id).value;
	luz.posicion[2] = pz;
}




// funciones de dirección de luces.
function direccionx(luz, id) {
	let dx = document.getElementById(id).value;
	luz.direccion[0] = dx;
}

function direcciony(luz, id) {
	let dy = document.getElementById(id).value;
	luz.direccion[1] = dy;
}

function direccionz(luz, id) {
	let dz = document.getElementById(id).value;
	luz.direccion[2] = dz;	
}



// funciones de intensidad de luces.
function intensidadr(luz, id) {
	let ir = document.getElementById(id).value;
	luz.intensidad[0] = ir;
}

function intensidadg(luz, id) {
	let ig = document.getElementById(id).value;
	luz.intensidad[1] = ig;
}

function intensidadb(luz, id) {
	let ib = document.getElementById(id).value;
	luz.intensidad[2] = ib;
}



function angulo_spot(luz) {
	let angulo = document.getElementById("angulo_spot").value;
	luz.angulo = angulo;
}



function iniciar_luces() {
	// se setean las luces (spot, puntual y direccional)
	let px = document.getElementById("pos_spotx").value;
	let py = document.getElementById("pos_spoty").value;
	let pz = document.getElementById("pos_spotz").value;
	let dx = document.getElementById("dir_spotx").value;
	let dy = document.getElementById("dir_spoty").value;
	let dz = document.getElementById("dir_spotz").value;
	let ir = document.getElementById("intensidad_spotr").value;
	let ig = document.getElementById("intensidad_spotg").value;
	let ib = document.getElementById("intensidad_spotb").value;
	let angulo = document.getElementById("angulo_spot").value;
	luz_spot = new Ligth([px,py,pz],[dx,dy,dz],angulo, [ir,ig,ib]);

	px = document.getElementById("pos_puntualx").value;
	py = document.getElementById("pos_puntualy").value;
	pz = document.getElementById("pos_puntualz").value;
	ir = document.getElementById("intensidad_puntualr").value;
	ig = document.getElementById("intensidad_puntualg").value;
	ib = document.getElementById("intensidad_puntualb").value;
	luz_puntual = new Ligth([px,py,pz],null,null,[ir,ig,ib]);

	dx = document.getElementById("dir_direccionalx").value;
	dy = document.getElementById("dir_direccionaly").value;
	dz = document.getElementById("dir_direccionalz").value;
	ir = document.getElementById("intensidad_puntualr").value;
	ig = document.getElementById("intensidad_puntualg").value;
	ib = document.getElementById("intensidad_puntualb").value;
	luz_direccional = new Ligth(null,[dx,dy,dz],null, [ir,ig,ib]);
}