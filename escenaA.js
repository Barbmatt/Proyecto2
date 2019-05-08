var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl;
var shader_m;
var shader_s;
var shader_r;
var shader_luz;
var camara; 						
var luz_puntual;					
var luz_direccional;					
var luz_spot;

// variables de matrices
var matriz_modelo_esfera = mat4.create();

//Aux variables,
var filas = 6;
var columnas = 4;
var objeto_esfera;
var objeto_luz;

// constante para objetos métalicos (copper)
var material_m = {
	ka: [0.33,0.22,0.03],
	kd: [0.78, 0.57, 0.11],
	ks: [0.99, 0.94, 0.8],
	n: 40
};

// constantes para objetos satinado 
var material_s = {
	pa: [0.19 ,0.07 ,0.02],
	pd: [0.7 ,0.27 ,0.08],
	ps: [0.26 ,0.14 ,0.09],
	alfa: 0.08
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

	shader_m = new Phong(phong_v,phong_f,gl);
	shader_s = new Ward(ward_v,ward_f,gl);
	shader_r = new Phong(goureaud_v,goureaud_f,gl);
	shader_luz = new Color_posicion(color_posicion_v, color_posicion_f);

	// objetos para las luces
	objeto_luz = new Model(esfera_obj,null,shader_luz.loc_posicion,null);

	// Cargo los objetos	
	objeto_esfera = new Model(esfera_obj,null,shader_m.loc_posicion,shader_m.loc_normal);
	mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);

	// se setean las cámaras (puntual, spot y direccional)
	camara = new Camara(canvas);
	let px = document.getElementById("pos_puntualx").value;
	let py = document.getElementById("pos_puntualy").value;
	let pz = document.getElementById("pos_puntualz").value;
	luz_puntual = new Ligth([px,py,pz],null,360);


	px = document.getElementById("pos_spotx").value;
	py = document.getElementById("pos_spoty").value;
	pz = document.getElementById("pos_spotz").value;
	let dx = document.getElementById("dir_spotx").value;
	let dy = document.getElementById("dir_spoty").value;
	let dz = document.getElementById("dir_spotz").value;
	let angulo = document.getElementById("angulo_spot").value;
	luz_spot = new Ligth([px,py,pz],[dx,dy,dz],angulo);


	dx = document.getElementById("dir_direccionalx").value;
	dy = document.getElementById("dir_direccionaly").value;
	dz = document.getElementById("dir_direccionalz").value;
	luz_direccional = new Ligth(null,[dx,dy,dz],360);

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

	// 0 = dibuja la posición, 1 = dibuja la dirección
	dibujar_luz(luz_puntual,0);
	dibujar_luz(luz_direccional,1);
	dibujar_luz(luz_spot,0);

	// Dibujar esferas
	
	// 1 = phong, 0 = ward
	dibujar_esfera(shader_m, material_m, 1, 0, luz_puntual);
	dibujar_esfera(shader_s, material_s, 0, 2, luz_puntual);
	dibujar_esfera(shader_r, material_r, 1, 4, luz_puntual);
	
	requestAnimationFrame(onRender);
}

function dibujar_luz(luz, que_dibujar) {
	gl.useProgram(shader_luz.shader_program);
	gl.uniformMatrix4fv(shader_luz.u_matriz_proyeccion, false, camara.proyeccion());
	let matriz_modelo_luz = mat4.create();
	let vector = null;
	if ( que_dibujar == 0 ) vector = luz.posL;
	else vector = luz.dirL;
	mat4.translate(matriz_modelo_luz,matriz_modelo_luz,vector);
	gl.uniformMatrix4fv(shader_luz.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_luz.u_matriz_modelo, false,matriz_modelo_luz);
	gl.bindVertexArray(objeto_luz.vao);
	gl.drawElements(gl.TRIANGLES, objeto_luz.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function dibujar_esfera(shader, material, tipo_shader, i, luz) {
	let j;
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	objeto_esfera.material = material;
	
	if ( tipo_shader == 1 ) {
		gl.uniform3f(shader.u_intensidad_ambiente,1,1,1);
		gl.uniform3f(shader.u_intensidad_difusa,1,1,1);
		gl.uniform3f(shader.u_intensidad_especular,1,1,1);
	}

	for (j=0;j<columnas;j++){
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(i-2.5)*4]);
		dibujar(shader, objeto_esfera, matriz_modelo_esfera, luz);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(i-2.5)*4]);

		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(i+1-2.5)*4]);
		dibujar(shader, objeto_esfera, matriz_modelo_esfera, luz);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(i+1-2.5)*4]);
	}
	gl.useProgram(null);
}

function dibujar(shader, objeto, matriz_modelo, luz) {
	shader.set_luz(luz);
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

function reset_camara() { camara.reset(); }

function toggle_camara() { 
	let select = document.getElementById("camara_seleccionada");
	if ( select.value == 1 ) select.value = 0;
	else select.value = 1;
}

function posicion_puntual() {
	let px = document.getElementById("pos_puntualx").value;
	/*\
		TODO:
		if ( !isNaN(px) ) posicion_puntual_vieja[0];
		if ( !isNaN(py) ) posicion_puntual_vieja[1];
		if ( !isNaN(pz) ) posicion_puntual_vieja[2];
	\*/

	let py = document.getElementById("pos_puntualy").value;

	let pz = document.getElementById("pos_puntualz").value;
	
	// document.getElementById("sliderx").value = px;
	// document.getElementById("slidery").value = py;
	// document.getElementById("sliderz").value = pz;

	luz_puntual.posL = [px,py,pz];
}