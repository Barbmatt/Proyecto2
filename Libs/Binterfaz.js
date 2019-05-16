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
function intensidadr(luz, id) {
	let valor = document.getElementById(id).value;
	ipuntual[0] = valor;
	luz.intensidad[0] = valor;
}

function intensidadg(luz, id) {
	let valor = document.getElementById(id).value;
	ipuntual[1] = valor;
	luz.intensidad[1] = valor;
}

function intensidadb(luz, id) {
	let valor = document.getElementById(id).value;
	ipuntual[2] = valor;
	luz.intensidad[2] = valor;
}



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
	// se setean las luces puntual y ambiente

	luz_puntual = new Light([0,0,0],[0,0,0],[0,0,0],0,[0,0,0]);
	ipuntual = [0,0,0];
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
function toggle() {
	let dibujar = luz_puntual.dibujar;
	if ( dibujar ) luz_puntual.intensidad = [0,0,0];
	else luz_puntual.intensidad = [ipuntual[0], ipuntual[1], ipuntual[2]];
	document.getElementById("intensidad_puntualr").disabled = dibujar;
	document.getElementById("intensidad_puntualg").disabled = dibujar;
	document.getElementById("intensidad_puntualb").disabled = dibujar;
	luz_puntual.dibujar = !dibujar;
	document.getElementById("dibujar_puntual").innerText = dibujar ? "Off" : "On";
}


function modificar_ka(material, id, i){
	material.ka[i] = document.getElementById(id).value;
}

function modificar_kd(material, id, i){
	material.kd[i] = document.getElementById(id).value;
}

function modificar_ks(material, id, i){
	material.ks[i] = document.getElementById(id).value;
}

function modificar_n(material,id){
	material.n = document.getElementById(id).value;
}

function modificar_rugosidad(material,id){
	material.alfa =  document.getElementById(id).value;
}

function modificar_reflectancia(material,id){
	material.f0 =  document.getElementById(id).value;
}
