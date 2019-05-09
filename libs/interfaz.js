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
	luz.posL[0] = px;
	console.log(luz.posL);
}

function posiciony(luz, id) {
	let py = document.getElementById(id).value;
	luz.posL[1] = py;
}

function posicionz(luz, id) {
	let pz = document.getElementById(id).value;
	luz.posL[2] = pz;
}




// funciones de dirección de luces.
function direccionx(luz, id) {
	let dx = document.getElementById(id).value;
	luz.dirL[0] = dx;
}

function direcciony(luz, id) {
	let dy = document.getElementById(id).value;
	luz.dirL[1] = dy;
}

function direccionz(luz, id) {
	let dz = document.getElementById(id).value;
	luz.dirL[2] = dz;
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

function angulo_spot() {
	let angulo = document.getElementById("angulo_spot").value;
	luz_spot.angulo = angulo;
}

function iniciar_luces() {
	// se setean las luces (spot, puntual y direccional)
	// let px = document.getElementById("pos_spotx").value;
	// let py = document.getElementById("pos_spoty").value;
	// let pz = document.getElementById("pos_spotz").value;
	// let dx = document.getElementById("dir_spotx").value;
	// let dy = document.getElementById("dir_spoty").value;
	// let dz = document.getElementById("dir_spotz").value;
	// let angulo = document.getElementById("angulo_spot").value;

	// px = document.getElementById("pos_puntualx").value;
	// py = document.getElementById("pos_puntualy").value;
	// pz = document.getElementById("pos_puntualz").value;

	// dx = document.getElementById("dir_direccionalx").value;
	// dy = document.getElementById("dir_direccionaly").value;
	// dz = document.getElementById("dir_direccionalz").value;

	// spot: [1.0,96,0.89], luz fluorescente
	// puntual: [1,0.58,0.16],luz de vela
	// direccional: [0.79,0.89,1], cielo cubierto

	let ir = document.getElementById("intensidad_spotr").value;
	let ig = document.getElementById("intensidad_spotr").value;
	let ib = document.getElementById("intensidad_spotr").value;
	luz_spot = new Ligth([0,0,0],[0,0,0],0, [ir,ig,ib]);

	ir = document.getElementById("intensidad_puntualr").value;
	ig = document.getElementById("intensidad_puntualr").value;
	ib = document.getElementById("intensidad_puntualr").value;
	luz_puntual = new Ligth([0,0,0],null,360, [ir,ig,ib]);

	ir = document.getElementById("intensidad_direccionalr").value;
	ig = document.getElementById("intensidad_direccionalr").value;
	ib = document.getElementById("intensidad_direccionalr").value;
	luz_direccional = new Ligth(null,[0,0,0],360, [ir,ig,ib]);
}