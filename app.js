var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl = null;
var shader_program1 = null;
var shader_program2 = null;
var shader_program3 = null;
var camara = null; 						// setea la cámara a utilizar
var luz = null;

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
var matriz_modelo_esfera = mat4.create();;
var matriz_normal_esfera = mat4.create();

//Aux variables,
var esfera = new Array(6);
for (var i=0;i<6;i++)
  esfera[i] = new Array(4); 		

// constante para objetos métalicos (copper)
var ka_m = [0.20,0.07,0.02];
var kd_m = [0.70,0.27,0.08];
var ks_m = [0.26,0.13,0.09];
var n_m = 12.8;

// constantes para objetos satinado 
var ka_s = [0.17,0.01,0.01];
var kd_s = [0.61,0.04,0.04];
var ks_s = [0.73,0.63,0.63];
var n_s = 76.8;

// constantes para objetos rugoso(Black Rubber)
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
	camara = new Camara(canvas);
	luz = new Ligth();

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

	// setear los uniforms generales
	gl.useProgram(shader_program);
	gl.uniformMatrix4fv(u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(u_matriz_proyeccion, false, camara.proyeccion());
	
	setear_luz();

	// Dibujar esferas
	for (let i=0;i<6;i++){
		for (let j=0;j<4;j++){
			mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[j*2,0,i*2]);
			dibujar(esfera[i][j], matriz_modelo_esfera);
			matriz_modelo_esfera =mat4.create();
		}	
	}


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
	let ka = material[0];  let kd = material[1]; let ks = material[2]; let n = material[3];
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

function cargar_modelos(loc_posicion, loc_normal) {

	for (let i=0;i<6;i++){
		for (let j=0;j<4;j++){
			esfera[i][j] = new Model(esferaSource,ka_m,kd_m,ks_m,n_m);
			esfera[i][j].generar_modelo(loc_posicion,loc_normal);
		}	
	}
}

function toggle_camara() { 
	let select = document.getElementById("camara_seleccionada");
	if ( select.value == 1 ) select.value = 0;
	else select.value = 1;
}