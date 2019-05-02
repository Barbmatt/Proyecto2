var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl = null;
var shader_program = null;
var camara = null; 						// setea la cámara a utilizar
var camara_mouse = null;
var luz = null;
var angulo_viejo_rotacion = 0;			// para rotar el cohete en su eje direccional

// variables uniformes
var u_matriz_modelo;
var u_matriz_modelo_r;
var u_matriz_modelo_m;
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

var matriz_normal_h = mat4.create();
var matriz_normal_r = mat4.create();
var matriz_normal_m = mat4.create();

//Aux variables,
var default_pos_r = [0,20,-15];
var objeto_house = null; 				//Parsed OBJ file house
var objeto_rocket = null; 				//Parsed OBJ file rocket
var objeto_mountain = null; 				//Parsed OBJ file mountain

// constantes para el objeto casa
var ka_h = [0.21,0.13,0.05];
var kd_h = [0.71,0.43,0.18];
var ks_h = [0.39,0.27,0.17];
var n_h = 25.6;

// constantes para el objeto cohete
var ka_r = [0.17,0.01,0.01];
var kd_r = [0.61,0.04,0.04];
var ks_r = [0.73,0.63,0.63];
var n_r = 76.8;

// constantes para el objeto montaña
var ka_m = [0.10,0.19,0.17];
var kd_m = [0.40,0.74,0.70];
var ks_m = [0.30,0.31,0.31];
var n_m = 12.8;


function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	// configuración del vertex shader
	shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	let loc_posicion = gl.getAttribLocation(shader_program, 'vertexPosition');
	let loc_normal = gl.getAttribLocation(shader_program, 'vertexNormal');
	
	u_matriz_modelo = gl.getUniformLocation(shader_program, 'modelMatrix');
	u_matriz_vista = gl.getUniformLocation(shader_program, 'viewMatrix');
	u_matriz_proyeccion = gl.getUniformLocation(shader_program, 'projectionMatrix');
	u_matriz_normal = gl.getUniformLocation(shader_program,'normalMatrix');
	u_posicion_luz = gl.getUniformLocation(shader_program,'posL');

	// configuración del fragment shader
	u_intensidad_ambiente = gl.getUniformLocation(shader_program,"intensidad_ambiente");
	u_intensidad_difusa = gl.getUniformLocation(shader_program,"intensidad_difusa");
	u_atenuacion = gl.getUniformLocation(shader_program,"func_atenuacion");
	u_constante_ambiente = gl.getUniformLocation(shader_program,"ka");
	u_constante_difusa = gl.getUniformLocation(shader_program,"kd");
	u_constante_especular = gl.getUniformLocation(shader_program,"ks");
	u_brillo = gl.getUniformLocation(shader_program,"n");

	// Cargo los objetos	
	cargar_modelos(loc_posicion, loc_normal);

	// se setean las cámaras
	camara = new Camara_esfericas();
	camara_mouse = new Camara_mouse(camara,canvas);
	luz = new Ligth();

	gl.clearColor(0.18, 0.18, 0.18, 1.0);;

	// posicionamiento inicial del cohete
	mat4.translate(matriz_modelo_r,matriz_modelo_r,default_pos_r);

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

	// setear los uniforms generales
	gl.useProgram(shader_program);
	gl.uniformMatrix4fv(u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(u_matriz_proyeccion, false, camara.proyeccion());
	
	setear_luz();

	dibujar(objeto_house, matriz_modelo_h);
	dibujar(objeto_rocket, matriz_modelo_r);
	dibujar(objeto_mountain, matriz_modelo_m);
	
	// ciclo dibujar nuevamente
	requestAnimationFrame(onRender);
}

function setear_luz() {
	let pos_l = luz.posL;
	let ia = luz.intensidad_ambiente;
	let id = luz.intensidad_difusa;
	luz.set_atenuacion(1.0,0.0,0.0,0.0);
	let atenuacion = luz.atenuacion;
	gl.uniform3f(u_posicion_luz, pos_l[0], pos_l[1], pos_l[2]);
	gl.uniform3f(u_intensidad_ambiente, ia[0], ia[1], ia[2]);
	gl.uniform3f(u_intensidad_difusa, id[0], id[1], id[2]);
	gl.uniform1f(u_atenuacion, atenuacion);
}

function dibujar(objeto,matriz_modelo) {
	setear_uniforms_material(objeto.material);
	setear_uniforms_matrices(matriz_modelo);
	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function setear_uniforms_material(material) {
	ka = material[0]; kd = material[1]; ks = material[2]; n = material[3];
	gl.uniform3f(u_constante_ambiente,ka[0],ka[1],ka[2]);
	gl.uniform3f(u_constante_difusa,kd[0],kd[1],kd[2]);
	gl.uniform3f(u_constante_especular,ks[0],ks[1],ks[2]);
	gl.uniform1f(u_brillo,n)
}

function setear_uniforms_matrices(matriz_modelo) {
	gl.uniformMatrix4fv(u_matriz_modelo, false,matriz_modelo);

	matriz_normal = mat4.create()
	mat4.multiply(matriz_normal,camara.vista(),matriz_modelo);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);

	gl.uniformMatrix4fv(u_matriz_normal, false, matriz_normal);
}

function control_automatica(now) {
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

function reset_camara() { camara.reset(); }

function cargar_modelos(loc_posicion, loc_normal) {
	objeto_house = new Model(house,ka_h,kd_h,ks_h,n_h);
	objeto_house.generar_modelo(loc_posicion,loc_normal);

	objeto_rocket = new Model(rocket,ka_r,kd_r,ks_r,n_r);
	objeto_rocket.generar_modelo(loc_posicion,loc_normal);

	objeto_mountain = new Model(mountain,ka_m,kd_m,ks_m,n_m);
	objeto_mountain.generar_modelo(loc_posicion,loc_normal);
}
