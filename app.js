var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl = null;
var shader_program = null;
var vao_h = null; 					
var vao_r = null;
var vao_m = null;
var cant_indices_r = 0;				
var cant_indices_h = 0;
var cant_indices_m = 0;
var camara = null; 	// setea la cámara a utilizar
var camara_mouse = null;
var angulo_viejo_rotacion = 0;			// para rotar el cohete en su eje direccional

// variables uniformes
var u_matriz_modelo;
var u_matriz_vista;
var u_matriz_proyeccion;
var u_matriz_normal;

var u_posicion_luz;
var u_intensidad_ambiente;
var u_intensidad_difusa;
var u_atenuacion;

var u_constante_ambiente;
var u_constante_difusa;
var u_constante_especular;
var u_brillo;

// variables de matrices
var matriz_modelo_h = mat4.create();
var matriz_modelo_r = mat4.create();
var matriz_modelo_m = mat4.create();

//Aux variables,
var default_pos_r = [0,20,-15];
var parsed_obj_h = null; 				//Parsed OBJ file
var parsed_obj_r = null; 				//Parsed OBJ file
var parsed_obj_m = null; 				//Parsed OBJ file

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	// se clickeó el botón de cargar y dibujar. ya no se va a utilizar
	document.getElementById('boton_cargar_dibujar').disabled = true;

	cargar_modelos();

	// obtener índices, posiciones y normales de la casa ([h]ouse)
	let indices_h = parsed_obj_h.indices;
	let posiciones_h = parsed_obj_h.positions;
	let normales_h = parsed_obj_h.normals;
	//let indices_h = Utils.indices_triangulos_a_lineas(indices_triangulos_h);
	cant_indices_h = indices_h.length;

	// lo mismo con el cohete ([r]ocket)
	let indices_r = parsed_obj_r.indices;
	let posiciones_r = parsed_obj_r.positions;
	let normales_r = parsed_obj_r.normals;
	//let indices_r = Utils.indices_triangulos_a_lineas(indices_triangulos_r);
	cant_indices_r = indices_r.length;

	// lo mismo con la montaña
	let indices_m = parsed_obj_m.indices;
	let posiciones_m = parsed_obj_m.positions;
	let normales_m = parsed_obj_m.normals;
	//let indices_m = Utils.indices_triangulos_a_lineas(indices_triangulos_m);
	cant_indices_m = indices_m.length;

	// configuración del vertex shader
	shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	let loc_posicion = gl.getAttribLocation(shader_program, 'vertexPosition');
	let loc_normal = gl.getAttribLocation(shader_program, 'vertexNormal');
	
	/* 
	 *
	 * TODO: más de una u_matriz_modelo?
	 *
	 */	
	
	
	u_matriz_modelo = gl.getUniformLocation(shader_program, 'modelMatrix');
	u_matriz_vista = gl.getUniformLocation(shader_program, 'viewMatrix');
	u_matriz_proyeccion = gl.getUniformLocation(shader_program, 'projectionMatrix');
	u_matriz_normal = gl.getUniformLocation(shaderProgram,'normalMatrix');
	u_posicion_luz = gl.getUniformLocation(shaderProgram,'posL');

	// configuración del fragment shader
	u_intensidad_ambiente = gl.getUniformLocation(shaderProgram,"intensidad_ambiente");
	u_intensidad_difusa = gl.getUniformLocation(shaderProgram,"intensidad_difusa");
	u_atenuacion = gl.getUniformLocation(shaderProgram,"func_atenuacion");
	u_constante_ambiente = gl.getUniformLocation(shaderProgram,"ka");
	u_constante_difusa = gl.getUniformLocation(shaderProgram,"kd");
	u_constante_especular = gl.getUniformLocation(shaderProgram,"ks");
	u_brillo = gl.getUniformLocation(shaderProgram,"n");

	// un arreglo de atributos para cada objeto
	let vertex_attribute_info_array_h = [
		new VertexAttributeInfo(posiciones_h, loc_posicion, 3),
		new VertexAttributeInfo(normales_h, loc_normal, 3)
	];

	let vertex_attribute_info_array_r = [
		new VertexAttributeInfo(posiciones_r, loc_posicion, 3),
		new VertexAttributeInfo(normales_r, loc_normal, 3)
	];

	let vertex_attribute_info_array_m = [
		new VertexAttributeInfo(posiciones_m, loc_posicion, 3),
		new VertexAttributeInfo(normales_m, loc_normal, 3)
	];

	// se crean los VAO de cada objeto
	vao_h = VAOHelper.create(indices_h, vertex_attribute_info_array_h);
	vao_r = VAOHelper.create(indices_r, vertex_attribute_info_array_r);
	vao_m = VAOHelper.create(indices_m, vertex_attribute_info_array_m);

	// se setean las cámaras
	camara = new Camara_esfericas();
	camara_mouse = new Camara_mouse(camara,canvas);
	
	gl.clearColor(0.18, 0.18, 0.18, 1.0);;

	// posicionamiento inicial del cohete
	mat4.translate(matriz_modelo_r,matriz_modelo_r,default_pos_r);

	// se habilitan los sliders para poder interactuar con la escena y se procede a pintar
	interfaz.deshabilitar_sliders_movimientos_reset_select(false);
	interfaz.deshabilitar_sliders_camara_reset(false);
	gl.enable(gl.DEPTH_TEST);

	dibujar_mountain();

	gl.bindVertexArray(null);

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}

function onRender(now) {
	// se controla en cada cuadro si la cámara es automática
	control_automatica();

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// setear el shader a utilizar con las matrices que necesita para dibujar la casa
	gl.useProgram(shader_program);
	gl.uniformMatrix4fv(u_matriz_modelo, false, matriz_modelo_h);
	gl.uniformMatrix4fv(u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(u_matriz_proyeccion, false, camara.proyeccion());

	// dibujar casa
	gl.bindVertexArray(vao_h);
	gl.drawElements(gl.LINES, cant_indices_h, gl.UNSIGNED_INT, 0);

	gl.bindVertexArray(null);

	// se cambia la matriz de modelo a la del cohete y se procede a dibujar
	gl.uniformMatrix4fv(u_matriz_modelo, false, matriz_modelo_r);
	gl.bindVertexArray(vao_r);
	gl.drawElements(gl.LINES, cant_indices_r, gl.UNSIGNED_INT, 0);

	// se cambia la matriz de modelo a la de la montaña y se procede a dibujar
	gl.uniformMatrix4fv(u_matriz_modelo, false, matriz_modelo_m);
	gl.bindVertexArray(vao_m);
	gl.drawElements(gl.LINES, cant_indices_m, gl.UNSIGNED_INT, 0);

	gl.bindVertexArray(null);

	gl.useProgram(null);

	// otra vez a dibujar
	requestAnimationFrame(onRender);
}

function control_automatica() {
	if ( interfaz.camara_seleccionada() == 'a' ) { // la cámara es automática
		// de milisegundos a segundos
		now *= 0.001;

		// tiempo entre este frame y el anterior
		let delta_tiempo = now - last_draw_time;

		// se establece el diferencial de ángulo a rotar en función del tiempo transcurrido y la velocidad deseada
		let angulo_nuevo_rotacion = delta_tiempo * velocidad_rotacion;

		// para evitar saltos de rotación (sobre todo en la primera iteración)
		if ( angulo_nuevo_rotacion > 1 ) angulo_nuevo_rotacion = 0;

		// se efectúa la rotación y se dibuja
		camara.rotar_camara(angulo_nuevo_rotacion);

		// guardar cuándo se realiza este frame y se vuelve a renderizar
		last_draw_time = now;
	}
}

function rotar_cohete(slider) {
	// el ángulo lo indica el slider
	let angulo_nuevo = parseFloat(slider.value);
	let i = angulo_viejo_rotacion;
	if ( angulo_viejo_rotacion < angulo_nuevo ) {
		// el ángulo nuevo es mayor, entonces se rota en sentido antihorario
		while ( i <= angulo_nuevo ) {
			// ya que el slider no recorre todos los valores entre dos estados, se fuerza a que lo haga para obtener un recorrido suave
			mat4.rotateX(matriz_modelo_r,matriz_modelo_r,1*Math.PI/180);
			i++;
		}
	}
	if ( angulo_viejo_rotacion > angulo_nuevo ) {
		// el ángulo nuevo es menor, entonces se rota en sentido horario
		while ( i >= angulo_nuevo ) {
			// ya que el slider no recorre todos los valores entre dos estados, se fuerza a que lo haga para obtener un recorrido suave
			mat4.rotateX(matriz_modelo_r,matriz_modelo_r,-1*Math.PI/180);
			i--;
		}
	}
	// actualización del ángulo actual ya que éste cambió al valor del slider
	angulo_viejo_rotacion = angulo_nuevo;
}

function orbitar_cohete(slider) {
	// el ángulo lo indica el slider
	let angulo = parseFloat(slider.value);
	// trasladar al origen
	matriz_modelo_r = mat4.create();
	// rotar la matriz de modelado del cohete
	mat4.rotateY(matriz_modelo_r,matriz_modelo_r,angulo*Math.PI/180);
	// trasladar a la posición correcta (inversa de la traslación al origen)
	mat4.translate(matriz_modelo_r,matriz_modelo_r,[0,20,-15]);
}

function rotar_casa(slider) {
	let angulo = parseFloat(slider.value);
	matriz_modelo_h = mat4.create();
	// rotar la matriz de modelado de la casa
	mat4.rotateY(matriz_modelo_h, matriz_modelo_h, angulo*Math.PI/180);
}

function cargar_modelos() {
	parsed_obj_h = OBJParser.parseFile(house);
	parsed_obj_r = OBJParser.parseFile(rocket);
	parsed_obj_m = OBJParser.parseFile(mountain);
}
