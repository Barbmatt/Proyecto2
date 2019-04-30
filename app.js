/* Porque no dibuja los objetos? modelmatriz?
 *		 
 */

var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl = null;
var shader_program = null;
var camara = null; 						// setea la cámara a utilizar
var camara_mouse = null;
var angulo_viejo_rotacion = 0;			// para rotar el cohete en su eje direccional

// variables uniformes
var u_matriz_modelo_h;
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
var parsed_obj_h = null; 				//Parsed OBJ file house
var parsed_obj_r = null; 				//Parsed OBJ file rocket
var parsed_obj_m = null; 				//Parsed OBJ file mountain

// constantes para el objeto casa
var constante_ambiente_house= [0.21,0.13,0.05];
var constante_difusa_house =[0.71,0.43,0.18];
var constante_especular_house =[0.39,0.27,0.17];
var brillo_house=25.6;

// constantes para el objeto cohete
var constante_ambiente_rocket= [0.17,0.01,0.01];
var constante_difusa_rocket =[0.61,0.04,0.04];
var constante_especular_rocket =[0.73,0.63,0.63];
var brillo_rocket=76.8;

// constantes para el objeto montaña
var constante_ambiente_mountain= [0.10,0.19,0.17];
var constante_difusa_mountain =[0.40,0.74,0.70];
var constante_especular_mountain =[0.30,0.31,0.31];
var brillo_mountain=12.8;


function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	// configuración del vertex shader
	shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	let loc_posicion = gl.getAttribLocation(shader_program, 'vertexPosition');
	let loc_normal = gl.getAttribLocation(shader_program, 'vertexNormal');
	
	u_matriz_modelo_h = gl.getUniformLocation(shader_program, 'modelMatrix');
	u_matriz_modelo_r = gl.getUniformLocation(shader_program, 'modelMatrix');
	u_matriz_modelo_m = gl.getUniformLocation(shader_program, 'modelMatrix');
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
	cargar_modelos(loc_posicion,loc_normal);
	
	// se setean las cámaras
	camara = new Camara_esfericas();
	camara_mouse = new Camara_mouse(camara,canvas);
	
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
	
	// Parametros de la luz
	let pos_l = [7,7,7];
	gl.uniform3f(u_posicion_luz, pos_l[0], pos_l[1], pos_l[2]);
	gl.uniform3f(u_intensidad_ambiente, 1.0, 1.0, 1.0);
	gl.uniform3f(u_intensidad_difusa, 1.0,1.0,1.0);
	gl.uniform1f(u_atenuacion, 0.7);

	// -------------dibujar casa---------------------
	matriz_modelo_h = mat4.create();
	mat4.translate(matriz_modelo_h,matriz_modelo_h,pos_l)
	parsed_obj_h.draw(gl,u_matriz_modelo_h,matriz_modelo_h,matriz_normal_h,constante_ambiente_house,
		constante_difusa_house,constante_especular_house,brillo_house);

	/*// se cambia la matriz de modelo a la del cohete y se procede a dibujar
	parsed_obj_r.draw(gl,u_matriz_modelo_r,matriz_normal_r,constante_ambiente_rocket,
		constante_difusa_rocket,constante_especular_rocket,brillo_rocket);

	// se cambia la matriz de modelo a la de la montaña y se procede a dibujar
	parsed_obj_m.draw(gl,u_matriz_modelo_m,matriz_normal_m,constante_ambiente_mountain,
		constante_difusa_mountain,constante_especular_mountain,brillo_mountain);*/

	// ciclo dibujar nuevamente
	requestAnimationFrame(onRender);
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

function cargar_modelos(loc_posicion,loc_normal) {
	// Cargo el modelo house
	parsed_obj_h = new Model(house);
	parsed_obj_h.generateModel(this.loc_posicion,this.loc_normal);

	/*// Cargo el modelo rocket
	parsed_obj_r = new Model(rocket);
	parsed_obj_r.generateModel(loc_posicion,loc_normal);

	// Cargo el modelo mountain
	parsed_obj_m = new Model(mountain);
	parsed_obj_m.generateModel(loc_posicion,loc_normal);*/
}
