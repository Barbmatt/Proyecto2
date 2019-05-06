var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl = null;
var shader_m = null;
var shader_s = null;
var shader_r = null;
var camara = null; 						// setea la cámara a utilizar
var luz = null;

// variables de matrices
var matriz_modelo_esfera = mat4.create();
var matriz_normal_esfera = mat4.create();

//Aux variables,
var filas = 6;
var columnas = 4;
var objeto_esfera = new Array(filas);
for (let i=0;i<filas;i++) objeto_esfera[i] = new Array(columnas); 

// constante para objetos métalicos (copper)
var material_m = {
	ka: [0.5,0.3,0.1],
	kd: [0.4,0.7,0.1],
	ks: [0.1,0.7,0.5],
	n: 20.0
};

// constantes para objetos satinado 
var material_s = {
	pd: [0.35,0.31,0.09],
	ps: [0.8,0.72,0.21],
	alfa: 0.8
};

// constantes para objetos rugoso(Black Rubber)
var material_r = { 
	ka: [0.10,0.19,0.17],
	kd: [0.40,0.74,0.70],
	ks: [0.30,0.31,0.31],
	n: 12.8
};

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	shader_m = new Phong(phong_v,phong_f);
	shader_s = new Ward(ward_v,ward_f);
	shader_r = new Phong(goureaud_v,goureaud_f);

	// Cargo los objetos	
	let j;
	for ( j=0;j<columnas;j++) {
		objeto_esfera[0][j] = new Model(esfera_obj,material_m,shader_m.loc_posicion,shader_m.loc_normal);
		objeto_esfera[1][j] = new Model(esfera_obj,material_m,shader_m.loc_posicion,shader_m.loc_normal);

		objeto_esfera[2][j] = new Model(esfera_obj,material_s,shader_s.loc_posicion,shader_s.loc_normal);
		objeto_esfera[3][j] = new Model(esfera_obj,material_s,shader_s.loc_posicion,shader_s.loc_normal);
		
		objeto_esfera[4][j] = new Model(esfera_obj,material_r,shader_r.loc_posicion,shader_r.loc_normal);
		objeto_esfera[5][j] = new Model(esfera_obj,material_r,shader_r.loc_posicion,shader_r.loc_normal);
	}

	// se setean las cámaras
	camara = new Camara(canvas);
	luz = new Ligth(10.0,-10.0,10.0);

	gl.clearColor(0.18, 0.18, 0.18, 1.0);;

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}


function onRender(now) {
	// se controla en cada cuadro si la cámara es automática
	control_automatica(now);

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Dibujar esferas
	let j;
	gl.useProgram(shader_m.shader_program);
	gl.uniformMatrix4fv(shader_m.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_m.u_matriz_proyeccion, false, camara.proyeccion());
	for (j=0;j<columnas;j++){
		matriz_modelo_esfera = mat4.create();
		mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(0-2.5)*4]);
		dibujar(shader_m, objeto_esfera[0][j], matriz_modelo_esfera);

		matriz_modelo_esfera = mat4.create();
		mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(1-2.5)*4]);
		dibujar(shader_m, objeto_esfera[1][j], matriz_modelo_esfera);
	}
	gl.useProgram(null);

	gl.useProgram(shader_s.shader_program);
	gl.uniformMatrix4fv(shader_s.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_s.u_matriz_proyeccion, false, camara.proyeccion());
	for (j=0;j<columnas;j++){
		matriz_modelo_esfera = mat4.create();
		mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(2-2.5)*4]);
		dibujar(shader_s, objeto_esfera[2][j], matriz_modelo_esfera);

		matriz_modelo_esfera = mat4.create();
		mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(3-2.5)*4]);
		dibujar(shader_s, objeto_esfera[3][j], matriz_modelo_esfera);
	}
	gl.useProgram(null);

	gl.useProgram(shader_r.shader_program);
	gl.uniformMatrix4fv(shader_r.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_r.u_matriz_proyeccion, false, camara.proyeccion());
	for (j=0;j<columnas;j++){
		matriz_modelo_esfera = mat4.create();
		mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(4-2.5)*4]);
		dibujar(shader_r, objeto_esfera[4][j], matriz_modelo_esfera);

		matriz_modelo_esfera = mat4.create();
		mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(5-2.5)*4]);
		dibujar(shader_r, objeto_esfera[5][j], matriz_modelo_esfera);
	}
	requestAnimationFrame(onRender);
}

function dibujar(shader, objeto, matriz_modelo) {
	shader.set_luz(luz);
	shader.set_material(objeto.material);
	setear_uniforms_objeto(shader, matriz_modelo);
	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function setear_uniforms_objeto(shader, matriz_modelo) {
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false,matriz_modelo);
	matriz_normal = mat4.create()
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

function reset_camara() { camara.reset(); }

function toggle_camara() { 
	let select = document.getElementById("camara_seleccionada");
	if ( select.value == 1 ) select.value = 0;
	else select.value = 1;
}