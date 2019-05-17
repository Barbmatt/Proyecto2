var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl;
var shader_ward, shader_phong, shader_luz, shader_cook;
var camara;

var luz_puntual;
var ipuntual;
var luz_ambiente;

// variables de matrices
//var matriz_modelo_suelo = mat4.create();
var matriz_modelo_balas = mat4.create();
var matriz_modelo_castillo = mat4.create();
var matriz_modelo_bote_cannon = mat4.create();
var matriz_modelo_luz = mat4.create();
var matriz_modelo_castlebase = mat4.create();
var matriz_modelo_arena = mat4.create();

//Aux variables,
var banderas, castillo, puerta;
var balas, barrels, ruedas, soporte;
var bote, hinges, remos;
var esfera_puntual;
var agua;
var castlebase;
var arena;

//random para las balas
let xrnd = new Array(12);
let yrnd = new Array(12);
let zrnd = new Array(12);

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	shader_phong = new Phong(gl);
	shader_ward = new Ward(gl);
	shader_luz = new Shader_luz(gl);
	shader_cook = new Cook(gl);

	// Elementos que componen al castillo
	banderas = new Model(banderas_obj, material_banderas, shader_cook.loc_posicion, shader_cook.loc_normal);

	castillo = new Model(castillo_obj, material_castillo, shader_ward.loc_posicion, shader_ward.loc_normal);
	mat4.translate(matriz_modelo_castillo,matriz_modelo_castillo,[0.0,1.3,0]);
	puerta = new Model(puerta_obj, material_puerta, shader_ward.loc_posicion, shader_ward.loc_normal);

	arena = new Model(arena_obj,material_sand, shader_phong.loc_posicion,shader_phong.loc_normal);

	// Elementos que componen al cañon
	barrels = new Model(barrels_obj, material_barrels, shader_cook.loc_posicion, shader_cook.loc_normal);
	balas = new Model(esfera_obj, material_balas, shader_cook.loc_posicion, shader_cook.loc_normal);
	ruedas = new Model(ruedas_obj, material_ruedas, shader_ward.loc_posicion, shader_ward.loc_normal);
	soporte = new Model(soporte_obj, material_soporte, shader_ward.loc_posicion, shader_ward.loc_normal);

	// Elementos que componen al bote
	bote = new Model(bote_obj,  material_bote, shader_ward.loc_posicion, shader_ward.loc_normal);
	hinges = new Model(hinges_obj, material_hinges, shader_ward.loc_posicion, shader_ward.loc_normal);
	remos = new Model(remos_obj, material_remos, shader_ward.loc_posicion, shader_ward.loc_normal);

	agua = new Model(agua_obj, material_agua, shader_phong.loc_posicion, shader_phong.loc_normal);


	// Luz en forma  de esfera
	esfera_puntual = new Model(esfera_obj, null, shader_luz.loc_posicion, null);

	camara = new Camara(canvas);
	reset_camara();

	iniciar_luces();

	gl.clearColor(0.01,0.01,0.08,1);;

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);

	mat4.scale(matriz_modelo_castillo, matriz_modelo_castillo, [10,10,10]);
	mat4.rotateY(matriz_modelo_castillo, matriz_modelo_castillo, 180);
	mat4.translate(matriz_modelo_castillo, matriz_modelo_castillo, [-2.5,0.04,-7]);


	mat4.scale(matriz_modelo_bote_cannon, matriz_modelo_bote_cannon, [8,8,8]);
	mat4.rotateY(matriz_modelo_bote_cannon, matriz_modelo_bote_cannon, 0.9);
	mat4.translate(matriz_modelo_bote_cannon, matriz_modelo_bote_cannon, [0.2,0.10,4.23]);


	for ( let i = 0; i < 12; i++) {
		xrnd[i] = Math.random();
		yrnd[i] = Math.random();
		zrnd[i] = Math.random();
	}

	mat4.translate(matriz_modelo_arena,matriz_modelo_arena,[46,0,26]);
	mat4.scale(matriz_modelo_arena,matriz_modelo_arena,[5,3.4,5]);

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}

function onRender(now) {
	// se controla en cada cuadro si la cámara es automática
	control_automatica(now);

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if ( luz_puntual.dibujar ) dibujar_luz();

	dibujar_agua();

	//dibujar_base(shader_phong, material_piso);

	dibujar_objeto(banderas, shader_cook, matriz_modelo_castillo);
	dibujar_objeto(castillo, shader_ward, matriz_modelo_castillo);
	dibujar_objeto(puerta, shader_ward, matriz_modelo_castillo);
	dibujar_objeto(arena,shader_phong,matriz_modelo_arena);

	dibujar_objeto(barrels, shader_cook, matriz_modelo_bote_cannon);
	dibujar_objeto(ruedas, shader_ward, matriz_modelo_bote_cannon);
	dibujar_objeto(soporte, shader_ward, matriz_modelo_bote_cannon);

	dibujar_objeto(bote, shader_ward, matriz_modelo_bote_cannon);
	dibujar_objeto(hinges, shader_cook, matriz_modelo_bote_cannon);
	dibujar_objeto(remos, shader_ward, matriz_modelo_bote_cannon);

	dibujar_balas();

	requestAnimationFrame(onRender);
}

function dibujar_luz() {
	gl.useProgram(shader_luz.shader_program);
	gl.uniformMatrix4fv(shader_luz.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader_luz.u_matriz_proyeccion, false, camara.proyeccion());
	shader_luz.set_luz(luz_puntual.intensidad);

	let matriz_modelo_luz = mat4.create();
	mat4.translate(matriz_modelo_luz, matriz_modelo_luz, luz_puntual.posicion);
	mat4.scale(matriz_modelo_luz, matriz_modelo_luz, [3,3,3]);

	gl.uniformMatrix4fv(shader_luz.u_matriz_modelo, false, matriz_modelo_luz);

	gl.bindVertexArray(esfera_puntual.vao);
	gl.drawElements(gl.TRIANGLES, esfera_puntual.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function dibujar_agua() {
	let matriz_modelo_agua;
	for ( let i = -1; i < 2; i++) {
		matriz_modelo_agua = mat4.create();
		mat4.translate(matriz_modelo_agua, matriz_modelo_agua, [0,0,i*50]);
		dibujar_objeto(agua, shader_phong, matriz_modelo_agua);
	}
}

function dibujar_balas() {
	let matriz_modelo_balas;
	for ( let i = -6; i < 6; i++) {
		matriz_modelo_balas = mat4.create();
		mat4.rotateY(matriz_modelo_balas, matriz_modelo_balas, -0.6);
		mat4.translate(matriz_modelo_balas, matriz_modelo_balas, [-10+xrnd[i+6]*10,8+yrnd[i+6]*5,(i*0.5-4)*3+zrnd[i+6]*2 ]);
		mat4.scale(matriz_modelo_balas, matriz_modelo_balas, [0.2,0.2,0.2]);
		dibujar_objeto(balas, shader_cook, matriz_modelo_balas);
	}
}

function dibujar_objeto(objeto, shader, matriz_modelo) {
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false, matriz_modelo);
	shader.set_luz(luz_puntual, luz_ambiente);
	shader.set_material(objeto.material);

	let matriz_normal = mat4.create();
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
