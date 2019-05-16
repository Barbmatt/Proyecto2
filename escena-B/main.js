var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl;
var shader_ward, shader_phong, shader_luz, shader_cook;
var camara;

var luz_puntual;
var luz_ambiente;

// variables de matrices
//var matriz_modelo_suelo = mat4.create();
var matriz_modelo_bala = mat4.create();
var matriz_modelo_castillo = mat4.create();
var matriz_modelo_bote_cannon = mat4.create();
var matriz_modelo_luz = mat4.create();
var matriz_modelo_castlebase = mat4.create();
var matriz_modelo_base = mat4.create();

//Aux variables,
var banderas, castillo, puerta;
var bala, barrels, cannon, ruedas, soporte;
var bote, hinges, remos;
var esfera_puntual;
var agua;
var castlebase;
var base_castillo;

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

	castillo = new Model(castillo_obj, material_castillo, shader_phong.loc_posicion, shader_phong.loc_normal);
	mat4.translate(matriz_modelo_castillo,matriz_modelo_castillo,[0.0,1.3,0]);
	puerta = new Model(puerta_obj, material_puerta, shader_ward.loc_posicion, shader_ward.loc_normal);

	base_castillo = new Model(sandLandscape,material_sand, shader_phong.loc_posicion,shader_phong.loc_normal);

	// Elementos que componen al cañon
	barrels = new Model(barrels_obj, material_barrels, shader_cook.loc_posicion, shader_cook.loc_normal);
	bala = new Model(esfera_obj, material_bala, shader_cook.loc_posicion, shader_cook.loc_normal);
	ruedas = new Model(ruedas_obj, material_ruedas, shader_phong.loc_posicion, shader_phong.loc_normal);
	soporte = new Model(soporte_obj, material_soporte, shader_ward.loc_posicion, shader_ward.loc_normal);

	// Elementos que componen al bote
	bote = new Model(bote_obj,  material_bote, shader_phong.loc_posicion, shader_phong.loc_normal);
	hinges = new Model(hinges_obj, material_hinges, shader_ward.loc_posicion, shader_ward.loc_normal);
	remos = new Model(remos_obj, material_remos, shader_phong.loc_posicion, shader_phong.loc_normal);

	agua = new Model(agua_obj, material_agua, shader_phong.loc_posicion, shader_phong.loc_normal);

	// Luz en forma  de esfera
	esfera_puntual = new Model(esfera_obj, null, shader_luz.loc_posicion, null);

	// Plataforma para el castillo
//	castlebase = new Model(castlebase_obj,material_piso,shader_phong.loc_posicion,shader_phong.loc_normal);
//	mat4.translate(matriz_modelo_castlebase,matriz_modelo_castlebase,[18.9,1.3,19.8]);
//	mat4.scale(matriz_modelo_castlebase,matriz_modelo_castlebase,[13,15,13]);

	camara = new Camara(canvas);

	iniciar_luces();

	gl.clearColor(0.04,0.04,0.04,1);;

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);

	mat4.scale(matriz_modelo_castillo, matriz_modelo_castillo, [8,8,8]);
	mat4.rotateY(matriz_modelo_castillo, matriz_modelo_castillo, 180);
	mat4.translate(matriz_modelo_castillo, matriz_modelo_castillo, [-2,0.3,-8]);
	mat4.translate(matriz_modelo_bote_cannon, matriz_modelo_bote_cannon, [30,1,40]);
	mat4.scale(matriz_modelo_bote_cannon, matriz_modelo_bote_cannon, [8,8,8]);
	mat4.rotateY(matriz_modelo_bote_cannon, matriz_modelo_bote_cannon, 0.8);


	mat4.scale(matriz_modelo_bala, matriz_modelo_bala, [0.1,0.1,0.1]);
	mat4.translate(matriz_modelo_bala, matriz_modelo_bala, [-20,50,-15]);

	mat4.translate(matriz_modelo_base,matriz_modelo_base,[54.5,0,37.8]);
	mat4.scale(matriz_modelo_base,matriz_modelo_base,[12,5,12]);

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
	dibujar_objeto(castillo, shader_phong, matriz_modelo_castillo);
	dibujar_objeto(puerta, shader_ward, matriz_modelo_castillo);
	dibujar_objeto(base_castillo,shader_phong,matriz_modelo_base);

	dibujar_objeto(barrels, shader_cook, matriz_modelo_bote_cannon);
	dibujar_objeto(bala, shader_ward, matriz_modelo_bala);
	dibujar_objeto(ruedas, shader_phong, matriz_modelo_bote_cannon);
	dibujar_objeto(soporte, shader_ward, matriz_modelo_bote_cannon);

	dibujar_objeto(bote, shader_phong, matriz_modelo_bote_cannon);
	dibujar_objeto(hinges, shader_cook, matriz_modelo_bote_cannon);
	dibujar_objeto(remos, shader_phong, matriz_modelo_bote_cannon);

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
	let matriz_modelo_agua_p = mat4.create();
	let matriz_modelo_agua_n = mat4.create();
	dibujar_objeto(agua, shader_phong, matriz_modelo_agua_p);
	mat4.translate(matriz_modelo_agua_p, matriz_modelo_agua_p, [0,0,50]);
	dibujar_objeto(agua, shader_phong, matriz_modelo_agua_p);
	mat4.translate(matriz_modelo_agua_n, matriz_modelo_agua_n, [0,0,-50]);
	dibujar_objeto(agua, shader_phong, matriz_modelo_agua_n);
}

//function dibujar_base(shader, material) {
//	castlebase.material = material;
//	dibujar_objeto(castlebase, shader, matriz_modelo_castlebase);
//}

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
