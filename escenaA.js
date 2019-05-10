
	/*\
		TODO:
			- if ( !isNaN(pz) ) posicion_puntual_vieja[2]; es decir, validar la entrada de cada textfield.
			- cambiar función de atenuación por algo distinto a 1.
			- poner las luces y las esferas con un mismo new Model.
			- distintas esferas con distinto shader pero con un único loc_posicion/normal de _m?? al crear la esfera
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

var luz_puntual;					
var luz_direccional;					
var luz_spot;

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

// constante para objetos métalicos (copper)
var material_m = {
	ka: [0.33,0.22,0.03],
	kd: [0.78, 0.57, 0.11],
	ks: [0.99, 0.94, 0.8],
	n: 40
};

// constantes para objetos satinado 
var material_s = {
	ka: [0.19 ,0.07 ,0.02],
	kd: [0.7 ,0.27 ,0.08],
	ks: [0.26 ,0.14 ,0.09],
	n: 0.08
};

// constantes para objetos rugoso(Black Rubber)
var material_r = { 
	ka: [0.10,0.19,0.17],
	kd: [0.40,0.74,0.70],
	ks: [0.30,0.31,0.31],
	n: 12.8
};

var material_suelo = {
	ka: [0,0,0],
	kd: [0.01,0.01,0.01],
	ks: [0.5,0.5,0.5],
	n: 32
};

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	shader_m = new Phong3(gl);
	shader_s = new Phong3(gl);
	shader_r = new Phong3(gl);
	shader_luz = new Color_posicion(gl);

	// objetos para las luces
	esfera_puntual = new Model(esfera_obj,shader_luz.loc_posicion,null);
	cono_spot = new Model(spot_obj,shader_luz.loc_posicion,null);


	// Cargo los objetos	
	esfera = new Model(esfera_obj,shader_m.loc_posicion,shader_m.loc_normal);
	mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);

	// cargo el suelo
	suelo = new Model(suelo_obj, shader_m.loc_posicion, shader_m.loc_normal);
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

	// 0 = puntual, 1 = direccional, 2 = spot
	dibujar_luz(luz_puntual,0, esfera_puntual);
	dibujar_luz(luz_direccional,1,esfera_puntual);
	dibujar_luz(luz_spot,2,cono_spot);

	dibujar_suelo(shader_m, material_suelo);

	// Dibujar esferas
	dibujar_esfera(shader_m, material_m, 0);
	dibujar_esfera(shader_s, material_s, 2);
	dibujar_esfera(shader_r, material_r, 4);
	
	requestAnimationFrame(onRender);
}

function dibujar_luz(luz, que_dibujar, objeto) {
	gl.useProgram(shader_luz.shader_program);
	gl.uniformMatrix4fv(shader_luz.u_matriz_proyeccion, false, camara.proyeccion());
	let vector = null;
	if ( que_dibujar == 0 || que_dibujar == 2 ) vector = luz.posicion;
	else vector = luz.direccion;
	let matriz_modelo_luz = mat4.create();
	if ( que_dibujar == 2 ) {
		let escala = 10*luz.angulo/180;
		mat4.scale(matriz_modelo_luz,matriz_modelo_luz,[escala,2,escala]);
		//mat4.rotate(matriz_modelo_luz,matriz_modelo_luz,luz.direccion);
	}
	mat4.translate(matriz_modelo_luz,matriz_modelo_luz,vector);
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
	shader.set_luz([1,1,1],luz_spot,luz_puntual,luz_direccional);
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
