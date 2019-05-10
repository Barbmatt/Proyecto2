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
var camara = new Camara_esfericas(); 	// setea la cámara a utilizar
var angulo_viejo_rotacion = 0;			// para rotar el cohete en su eje direccional

// variables de matrices
var u_matriz_modelo;
var u_matriz_vista;
var u_matriz_proyeccion;
var matriz_modelo_h = mat4.create();
var matriz_modelo_r = mat4.create();
var matriz_modelo_m = mat4.create();

//Aux variables,
var default_zoom = 63;
var default_paneo = 45;
var default_altura = 30;
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

	// obtener índices de la casa ([h]ouse) y convertirlos de triángulos a líneas
	let indices_triangulos_h = parsed_obj_h.indices;
	let indices_h = Utils.indices_triangulos_a_lineas(indices_triangulos_h);
	cant_indices_h = indices_h.length;

	// posiciones y sus colores (todos blancos)
	let posiciones_h = parsed_obj_h.positions;
	let colores_h = Utils.pintar_con_color(posiciones_h.length,255);

	// lo mismo con el cohete ([r]ocket)
	let indices_triangulos_r = parsed_obj_r.indices;
	let indices_r = Utils.indices_triangulos_a_lineas(indices_triangulos_r);
	cant_indices_r = indices_r.length;

	let posiciones_r = parsed_obj_r.positions;
	let colores_r = Utils.pintar_con_posiciones(posiciones_r);

	// lo mismo con la montaña
	let indices_triangulos_m = parsed_obj_m.indices;
	let indices_m = Utils.indices_triangulos_a_lineas(indices_triangulos_m);
	cant_indices_m = indices_m.length;

	let posiciones_m = parsed_obj_m.positions;
	let colores_m = Utils.pintar_con_color(posiciones_m.length,0);

	// configuración el vertex y fragment shader
	shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	let posLocation = gl.getAttribLocation(shader_program, 'vertexPos');
	let colLocation = gl.getAttribLocation(shader_program, 'vertexCol');
	u_matriz_modelo = gl.getUniformLocation(shader_program, 'modelMatrix');
	u_matriz_vista = gl.getUniformLocation(shader_program, 'viewMatrix');
	u_matriz_proyeccion = gl.getUniformLocation(shader_program, 'projMatrix');

	// un arreglo de atributos para cada objeto
	let vertex_attribute_info_array_h = [
		new VertexAttributeInfo(posiciones_h, posLocation, 3),
		new VertexAttributeInfo(colores_h, colLocation, 3)
	];

	let vertex_attribute_info_array_r = [
		new VertexAttributeInfo(posiciones_r, posLocation, 3),
		new VertexAttributeInfo(colores_r, colLocation, 3)
	];

	let vertex_attribute_info_array_m = [
		new VertexAttributeInfo(posiciones_m, posLocation, 3),
		new VertexAttributeInfo(colores_m, colLocation, 3)
	];

	// se crean los VAO de cada objeto
	vao_h = VAOHelper.create(indices_h, vertex_attribute_info_array_h);
	vao_r = VAOHelper.create(indices_r, vertex_attribute_info_array_r);
	vao_m = VAOHelper.create(indices_m, vertex_attribute_info_array_m);

	gl.clearColor(0.18, 0.18, 0.18, 1.0);;

	// posicionamiento inicial del cohete
	mat4.translate(matriz_modelo_r,matriz_modelo_r,default_pos_r);

	// se habilitan los sliders para poder interactuar con la escena y se procede a pintar
	interfaz.deshabilitar_sliders_movimientos_reset_select(false);
	interfaz.deshabilitar_sliders_camara_reset(false);
	gl.enable(gl.DEPTH_TEST);
	onRender();
}

function onRender() {
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

	gl.bindVertexArray(null);

	// se cambia la matriz de modelo a la de la montaña y se procede a dibujar
	gl.uniformMatrix4fv(u_matriz_modelo, false, matriz_modelo_m);
	gl.bindVertexArray(vao_m);
	gl.drawElements(gl.LINES, cant_indices_m, gl.UNSIGNED_INT, 0);

	gl.bindVertexArray(null);
	gl.useProgram(null);
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
	onRender();
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
	onRender();
}

function rotar_casa(slider) {
	let angulo = parseFloat(slider.value);
	matriz_modelo_h = mat4.create();
	// rotar la matriz de modelado de la casa
	mat4.rotateY(matriz_modelo_h, matriz_modelo_h, angulo*Math.PI/180);
	onRender();
}

function control_camara() {
	if ( interfaz.camara_seleccionada() == 'm' ) {
	// si la cámara es manual, se pueden mover los sliders
		interfaz.deshabilitar_sliders_camara_reset(false);
	}
	else {
		// si la cámara es automática, se deshabilitan los sliders de zoom, paneo y altura
		interfaz.deshabilitar_sliders_camara_reset(true);
		// se procede a realizar la animación
		requestAnimationFrame(animacion,0);
	}
}

function animacion(now,it) {
	// se controla en cada cuadro si la cámara es automática
	if ( interfaz.camara_seleccionada() == 'a' ) {
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
		onRender();

		// guardar cuándo se realiza este frame y se vuelve a renderizar
		last_draw_time = now;
		requestAnimationFrame(animacion);
	}
	else {
		// la cámara pasó de automática a manual por parte del usuario: controles manuales habilitados
		interfaz.deshabilitar_sliders_camara_reset(false);
	}
}

function paneo(slider) {
	camara.paneo(parseFloat(slider.value));
	onRender();
}

function zoom(slider) {
	camara.zoom(parseFloat(slider.value));
	onRender();
}

function altura(slider) {
	camara.altura(parseFloat(slider.value));
	onRender();
}

function reset_camera() {
	camara.reset();
	interfaz.setear_valores_sliders_camara(default_paneo,default_zoom,default_altura);
	onRender();
}

function cargar_modelos() {
	parsed_obj_h = OBJParser.parseFile(house);
	parsed_obj_r = OBJParser.parseFile(rocket);
	parsed_obj_m = OBJParser.parseFile(mountain);
}
