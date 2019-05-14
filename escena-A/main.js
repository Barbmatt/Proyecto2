
/*\
	TODO:
		- if ( !isNaN(pz) ) posicion_puntual_vieja[2]; es decir, validar la entrada de cada textfield.
		- cambiar función de atenuación por algo distinto a 1.
		- poner las luces y las esferas con un mismo new Model.
		- distintas esferas con distinto shader pero con un único loc_posicion/normal de _m?? al crear la esfera
		- rotar vectores de luces
\*/



var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl;
var shader_m;
var shader_s;
var shader_r;
var shader_luz;
var camara;

// direccional: [0.79, 0.89, 1], cielo cubierto
// spot: [1.0.96,0.89], luz fluorescente
// puntual: [1,0.58,0.16],luz de vela

var luz_spot;
var luz_puntual;
var luz_direccional;
var luz_ambiente;

// variables de matrices
var matriz_modelo_esfera = mat4.create();
var matriz_modelo_suelo = mat4.create();
var matriz_modelo_spot = mat4.create();

//Aux variables,
var filas = 6;
var columnas = 4;
var esfera;
var suelo;
var esfera_puntual;
var cono_spot;
var flecha_direccional;

// constante para objetos métalicos (copper)
var material_m = {
	ka: [0.25,0.25,0.25],
	kd: [0.4, 0.4, 0.4],
	ks: [0.77, 0.77, 0.77],
	alfa: 0.05,
	f0: 10
};

// constantes para objetos satinado
var material_s = {
	ka: [0.10,0.19,0.17],
	kd: [0.40,0.74,0.70],
	ks: [0.30,0.31,0.31],
	alfa: -0.37,
	f0: 1
};

// constantes para objetos rugoso(Black Rubber)
var material_r = {
	ka: [0.11,0.06,0.11],
	kd: [0.43,0.47,0.54],
	ks: [0.33,0.33,0.52],
	n: 9.85
};

var material_suelo = {
	ka: [0,0,0],
	kd: [0.01,0.01,0.01],
	ks: [0.5,0.5,0.5],
	n: 32
};

let a = 0, f = 0;

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	shader_m = new Cook3(gl);
	shader_s = new Cook3(gl);
	shader_r = new Ward3(gl);
	shader_suelo = new Phong3(gl);
	shader_luz = new Color_posicion(gl);

	// objetos para las luces
	esfera_puntual = new Model(esfera_obj,shader_luz.loc_posicion,null);
	cono_spot = new Model(spot_obj,shader_luz.loc_posicion,null);
	flecha_direccional = new Model(direccional_obj,shader_luz.loc_posicion,null);


	// Cargo los objetos
	esfera = new Model(esfera_obj,shader_m.loc_posicion,shader_m.loc_normal);
	mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);

	// cargo el suelo
	suelo = new Model(suelo_obj, shader_suelo.loc_posicion, shader_suelo.loc_normal);
	mat4.translate(matriz_modelo_suelo,matriz_modelo_suelo,[0,-4.568,0]);
	mat4.scale(matriz_modelo_suelo,matriz_modelo_suelo,[1000,15,1000]);

	camara = new Camara(canvas);

	iniciar_luces();

	gl.clearColor(0.04,0.04,0.04,1);;

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);

	gl.useProgram(shader_luz.shader_program);

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}

function onRender(now) {
	// se controla en cada cuadro si la cámara es automática
	control_automatica(now);

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// 0 = spot, 1 = puntual, 2 = direccional

	// if ( luz_spot.dibujar ) dibujar_luz(luz_spot,0,cono_spot);
	// if ( luz_puntual.dibujar ) dibujar_luz(luz_puntual,1, esfera_puntual);
	// if ( luz_direccional.dibujar ) dibujar_luz(luz_direccional,2,flecha_direccional);

	//dibujar_suelo(shader_suelo, material_suelo);

	// Dibujar esferas
	dibujar_esfera(shader_m, material_m, 0);
	dibujar_esfera(shader_s, material_s, 2);
	dibujar_esfera(shader_r, material_r, 4);

	requestAnimationFrame(onRender);
}

function f0_m(slider) {
	console.log(Math.exp(parseFloat(slider.value)));
	material_m.f0 = Math.exp(parseFloat(slider.value));
}

function alfa_m(slider) {
	console.log(Math.log(parseFloat(slider.value)));
	material_m.alfa = Math.log(parseFloat(slider.value));
}

function f0_s(slider) {
	console.log(slider.value);
	material_s.f0 = Math.exp(parseFloat(slider.value));
}

function alfa_s(slider) {
	console.log(slider.value);
	material_s.alfa = Math.log(parseFloat(slider.value));
}

function f0_r(slider) {
	console.log(slider.value);
	material_r.f0 = Math.exp(parseFloat(slider.value));
}

function alfa_r(slider) {
	console.log(slider.value);
	material_r.alfa = Math.log(parseFloat(slider.value));
}

function dibujar_luz(luz, que_dibujar, objeto) {
	gl.useProgram(shader_luz.shader_program);
	gl.uniformMatrix4fv(shader_luz.u_matriz_proyeccion, false, camara.proyeccion());
	let vector = [0,0,0];
	if ( que_dibujar == 0 || que_dibujar == 1 ) vector = luz.posicion;
	let matriz_modelo_luz = mat4.create();
	mat4.translate(matriz_modelo_luz,matriz_modelo_luz,vector);
	let intensidad = luz.intensidad;
	gl.uniform3f(shader_luz.u_intensidad, intensidad[0],intensidad[1],intensidad[2]);
	if ( que_dibujar == 0 ) {
		// rotar cono de spot
		let escala = 10*luz.angulo/180;
		mat4.targetTo(matriz_modelo_luz, luz.posicion, [0,1,0], luz.direccion);
		mat4.scale(matriz_modelo_luz, matriz_modelo_luz, [escala,1,escala]);
	}
	else if ( que_dibujar == 2 ) {
		mat4.targetTo(matriz_modelo_luz, [0,0,0], [0,1,0], luz.direccion);
	}
	gl.uniformMatrix4fv(shader_luz.u_matriz_modelo, false,matriz_modelo_luz);

	gl.uniformMatrix4fv(shader_luz.u_matriz_vista, false, camara.vista());

	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function dibujar_suelo(shader, material) {
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	suelo.material = material;
	dibujar(shader, suelo, matriz_modelo_suelo);
	gl.useProgram(null);
}

function dibujar_esfera(shader, material, i) {
	let j;
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	esfera.material = material;

	for (j=0;j<columnas;j++){
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(i-2.5)*4]);
		dibujar(shader, esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(i-2.5)*4]);

		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(i+1-2.5)*4]);
		dibujar(shader, esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(i+1-2.5)*4]);
	}
	gl.useProgram(null);
}

function dibujar(shader, objeto, matriz_modelo) {
	shader.set_luz(luz_ambiente,luz_spot,luz_puntual,luz_direccional);
	shader.set_material(objeto.material);
	setear_uniforms_objeto(shader, matriz_modelo);
	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function setear_uniforms_objeto(shader, matriz_modelo) {
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false,matriz_modelo);
	let matriz_normal = mat4.create()
	mat4.multiply(matriz_normal,camara.vista(),matriz_modelo);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);

	gl.uniformMatrix4fv(shader.u_matriz_normal, false, matriz_normal);
}

function control_automatica(now) {
	if ( document.getElementById("camara_seleccionada").value == 1 ) { // la cámara es automática
		// de milisegundos a segundos
		now *= 0.001;

		// tiempo entre este frame y el anterior
		let delta_tiempo = now - last_draw_time;

		// se establece el diferencial de ángulo a rotar en función del tiempo transcurrido y la velocidad deseada
		let angulo_nuevo_rotacion = delta_tiempo * velocidad_rotacion;

		// para evitar saltos de rotación (sobre todo en la primera iteración)
		if ( angulo_nuevo_rotacion > 1 ) angulo_nuevo_rotacion = 0;

		// se efectúa la rotación y se dibuja
		camara.paneo(angulo_nuevo_rotacion);

		// guardar cuándo se realiza este frame y se vuelve a renderizar
		last_draw_time = now;
	}
}
