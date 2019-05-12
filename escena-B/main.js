
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
var shader_ward;
var shader_phong;
var camara;

var luz_spot;
var luz_puntual;
var luz_direccional;
var luz_ambiente;

// variables de matrices
var matriz_modelo_bala = mat4.create();
//var matriz_modelo_suelo = mat4.create();
var matriz_modelo_castillo = mat4.create();
var matriz_modelo_luz = mat4.create();

//Aux variables,
var banderas, cannon, bala, castillo, puerta;
var esfera_puntual;

var material_banderas = {
	ka: [0.19 ,0.07 ,0.02],
	kd: [0.7 ,0.27 ,0.08],
	ks: [0.26 ,0.14 ,0.09],
	n: 20
};

var material_cannon = {
	ka: [0.19 ,0.07 ,0.02],
	kd: [0.7 ,0.27 ,0.08],
	ks: [0.26 ,0.14 ,0.09],
	n: 20
};

var material_castillo = {
	ka: [0.23,0.23,0.23],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	n: 0.12
};

var material_bala = {
	ka: [0.10,0.19,0.17],
	kd: [0.40,0.74,0.70],
	ks: [0.30,0.31,0.31],
	n: 12.8
};

var material_puerta = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	shader_phong = new Phong3(gl);
	shader_ward = new Ward3(gl);

	banderas = new Model(banderas_obj, material_banderas, shader_phong.loc_posicion, shader_phong.loc_normal);
	cannon = new Model(cannon_obj,  material_cannon, shader_ward.loc_posicion, shader_ward.loc_normal);
	castillo = new Model(castillo_obj, material_castillo, shader_phong.loc_posicion, shader_phong.loc_normal);
	bala = new Model(esfera_obj, material_bala, shader_ward.loc_posicion, shader_ward.loc_normal);
	puerta = new Model(puerta_obj, material_puerta, shader_ward.loc_posicion, shader_ward.loc_normal);

	esfera_puntual = new Model(esfera_obj, material_banderas, shader_phong.loc_posicion, shader_phong.loc_normal);

	camara = new Camara(canvas);

	iniciar_luces();

	gl.clearColor(0.04,0.04,0.04,1);;

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);

	mat4.scale(matriz_modelo_castillo, matriz_modelo_castillo, [3,3,3]);
	mat4.translate(matriz_modelo_luz, matriz_modelo_luz, luz_puntual.posicion);

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}

function onRender(now) {
	// se controla en cada cuadro si la cámara es automática
	control_automatica(now);

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Dibujar esferas
	dibujar_objeto(esfera_puntual, shader_phong, matriz_modelo_luz);
	dibujar_objeto(banderas, shader_phong, matriz_modelo_castillo);
	dibujar_objeto(castillo, shader_phong, matriz_modelo_castillo);
	dibujar_objeto(puerta, shader_ward, matriz_modelo_castillo);

	requestAnimationFrame(onRender);
}

function dibujar_objeto(objeto, shader, matriz_modelo) {
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false, matriz_modelo);
	shader.set_luz(luz_ambiente,luz_spot,luz_puntual,luz_direccional);
	shader.set_material(objeto.material);

	let matriz_normal = mat4.create()
	mat4.multiply(matriz_normal,camara.vista(),matriz_modelo);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);
	gl.uniformMatrix4fv(shader.u_matriz_normal, false, matriz_normal);

	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
	gl.useProgram(null);
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
