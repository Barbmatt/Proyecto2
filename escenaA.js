var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl = null;
var shader_m = null;
var shader_s = null;
var shader_r = null;
var shader_luz = null;
var camara = null; 						// setea la cámara a utilizar
var luz = null;

// variables de matrices
var matriz_modelo_esfera = mat4.create();
var matriz_modelo_luz = mat4.create();
var matriz_normal_esfera = mat4.create();

//Aux variables,
var filas = 6;
var columnas = 4;
var objeto_esfera;
var objetoLuz = null;

// constante para objetos métalicos (copper)
var material_m = {
	ka: [0.23,0.23,0.23],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 077, 077],
	n: 89.6
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
	shader_luz = new Color_posicion(color_posicion_v, color_posicion_f);

	objetoLuz = new Model(esfera_obj,null,shader_luz.loc_posicion,null);


	// Cargo los objetos	
	objeto_esfera = new Model(esfera_obj,material_m,shader_m.loc_posicion,shader_m.loc_normal);
	mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);

	// se setean las cámaras
	camara = new Camara(canvas);
	let x = document.getElementById("textox").value;
	let y = document.getElementById("textoy").value;
	let z = document.getElementById("textoz").value;
	luz = new Ligth(x,y,z);

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

	// dibujar esfera en la luz
	gl.useProgram(shader_luz.shader_program);
	gl.uniformMatrix4fv(shader_luz.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_luz.u_matriz_proyeccion, false, camara.proyeccion());
	matriz_modelo_luz = mat4.create();
	mat4.translate(matriz_modelo_luz, matriz_modelo_luz, luz.posL);
	gl.uniformMatrix4fv(shader_luz.u_matriz_modelo, false,matriz_modelo_luz);
	gl.bindVertexArray(objetoLuz.vao);
	gl.drawElements(gl.TRIANGLES, objetoLuz.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
	gl.useProgram(null);

	// Dibujar esferas
	let j;
	gl.useProgram(shader_m.shader_program);
	gl.uniformMatrix4fv(shader_m.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_m.u_matriz_proyeccion, false, camara.proyeccion());
	gl.uniform3f(shader_m.u_intensidad_ambiente,1,1,1);
	gl.uniform3f(shader_m.u_intensidad_difusa,1,1,1);
	gl.uniform3f(shader_m.u_intensidad_especular,1,1,1);
	objeto_esfera.material = material_m;

	for (j=0;j<columnas;j++){
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(0-2.5)*4]);
		dibujar(shader_m, objeto_esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(0-2.5)*4]);

		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(1-2.5)*4]);
		dibujar(shader_m, objeto_esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(1-2.5)*4]);
	}
	gl.useProgram(null);

	gl.useProgram(shader_s.shader_program);
	gl.uniformMatrix4fv(shader_s.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_s.u_matriz_proyeccion, false, camara.proyeccion());
	objeto_esfera.material = material_s;

	for (j=0;j<columnas;j++){
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(2-2.5)*4]);
		dibujar(shader_s, objeto_esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(2-2.5)*4]);

		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(3-2.5)*4]);
		dibujar(shader_s, objeto_esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(3-2.5)*4]);
	}
	gl.useProgram(null);

	gl.useProgram(shader_r.shader_program);
	gl.uniformMatrix4fv(shader_r.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_r.u_matriz_proyeccion, false, camara.proyeccion());
	objeto_esfera.material = material_r;
	gl.uniform3f(shader_r.u_intensidad_ambiente,1,1,1);
	gl.uniform3f(shader_r.u_intensidad_difusa,1,1,1);
	gl.uniform3f(shader_r.u_intensidad_especular,1,1,1);

	for (j=0;j<columnas;j++){
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(4-2.5)*4]);
		dibujar(shader_r, objeto_esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(4-2.5)*4]);

		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(5-2.5)*4]);
		dibujar(shader_r, objeto_esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(5-2.5)*4]);
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

function luz_texto() {
	let textox = document.getElementById("textox");
	if  ( textox.value > 200 ) textox.value = 200;
	else if ( textox.value < -200 ) textox.value = -200;

	let textoy = document.getElementById("textoy");
	if  ( textoy.value > 100 ) textoy.value = 100;
	else if ( textoy.value < -100 ) textoy.value = -100;

	let textoz = document.getElementById("textoz");
	if  ( textoz.value > 200 ) textoz.value = 200;
	else if ( textoz.value < -200 ) textoz.value = -200;
	
	document.getElementById("sliderx").value = textox.value;
	document.getElementById("slidery").value = textoy.value;
	document.getElementById("sliderz").value = textoz.value;

	luz.posL = [textox.value,textoy.value,textoz.value];
}

function luz_slider() {
	let sliderx = document.getElementById("sliderx").value;
	let slidery = document.getElementById("slidery").value;
	let sliderz = document.getElementById("sliderz").value;

	
	document.getElementById("textox").value = sliderx;
	document.getElementById("textoy").value = slidery;
	document.getElementById("textoz").value = sliderz;

	luz.posL = [sliderx,slidery,sliderz];
}