//Variables para los objetos
var gl = null;
var shaderProgram  = null; //Shader program to use.
var vao = null;
var vao2 =null; //Geometry to render (stored in VAO).
var vao3 = null;
var vao4=null;
var parsedOBJ = null; //Archivos OBJ Traducidos para que los pueda leer webgl2
var parsedOBJ2 = null;
var parsedOBJ3 = null;
var parsedOBJ4 = null;
var indexCount = 0; //Contador de indices. Sirve para saber cuantas veces ejecutar el draw 
var indexCount2= 0;
var indexCount3=0;
var indexCount4=0;
var obj1center=[]; //Centro de cada objeto
var obj2center=[];
var obj3center=[];
var obj4center=[];

//Uniform locations.
var u_satelliteMatrix;
var u_planetMatrix;
var u_ring1Matrix;
var u_ring2Matrix;
var u_viewMatrix;
var u_projectionMatrix;
var u_normalMatrix;
var u_posL;
var u_intensidad_ambiente;
var u_intensidad_difusa;
var u_func_atenuacion;
var u_ka;
var u_kd;
var u_ks;
var u_n;

//Uniform values.
var satelliteMatrix = mat4.create();
var planetMatrix = mat4.create();
var ring1Matrix = mat4.create();
var ring2Matrix = mat4.create();
var viewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var normalMatrixPlanet = mat4.create();
var normalMatrixSatellite = mat4.create();
var normalMatrixRing1 = mat4.create();
var normalMatrixRing2 = mat4.create();

var angle = [];
//Variables para generar la camara esferica
var camaraEsferica;
var eye = [2, 2, 2];
var target = [0, 0, 0];
var up = [0, 1, 0];

//Guardo los sliders para resetear todo a sus posiciones iniciales
//Se cargaran cuando el usuario mueva algun slider
var slider=[];
//Variables de control
var changed = false; //Es true si algun valor fue cambiado desde el ultimo reset
var fullScreen = false;//Es true si esta en pantalla completa
var rotationAngle=[];
var animated = [];
var then = 0;
var rotationSpeed = 30;

/*Esta funcion se ejecuta al cargar la pagina. Carga todos los objetos para que luego sean dibujados, asi como los valores iniciales
de las variables a utilizar*/
function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');
	
	//Cargo los objetos a la escena
	onModelLoad();
	cargarSliders();//Cargo los sliders
	let indices = parsedOBJ.indices;//Planeta
	//Tengo que convertir los indices de triangulos a indices de lineas
	//indices = convertIndexes(indices);
	let indices2 = parsedOBJ2.indices;//Satelite
	//indices2 = convertIndexes(indices2);
	let indices3 = parsedOBJ3.indices;//Anillo interior
	//indices3 = convertIndexes(indices3);
	let indices4 = parsedOBJ4.indices;//Anillo exterior
	//indices4 = convertIndexes(indices4);
	
	indexCount = indices.length;
	indexCount2 = indices2.length;
	indexCount3 = indices3.length;
	indexCount4 = indices4.length;
	
	let positions = parsedOBJ.positions;
	let normals = parsedOBJ.normals;//Will use position coordinates as colors (as example)
	let positions2 = parsedOBJ2.positions;
	let normals2 = parsedOBJ2.normals;//Will use position coordinates as colors (as example)
	let positions3 = parsedOBJ3.positions;
	let normals3 = parsedOBJ3.normals;
	let positions4 = parsedOBJ4.positions;
	let normals4 = parsedOBJ4.normals;

	/*Calculo de las Bounding Boxes para todos los objetos*/
	obj1center=Utils.boundingBoxCenter(parsedOBJ.positions);
	console.log(obj1center);
	obj2center=Utils.boundingBoxCenter(parsedOBJ2.positions);
	console.log(obj2center);
	obj3center=Utils.boundingBoxCenter(parsedOBJ3.positions);
	console.log(obj3center);
	obj4center=Utils.boundingBoxCenter(parsedOBJ4.positions);
	console.log(obj4center);
	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	// VERTEX SHADER
	
	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
	//let colLocation = gl.getAttribLocation(shaderProgram, 'vertexCol');
	console.log(posLocation)
	let normalLocation = gl.getAttribLocation(shaderProgram, 'vertexNormal');
	u_satelliteMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_planetMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_ring1Matrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_ring2Matrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_posL = gl.getUniformLocation(shaderProgram,'posL');
	u_normalMatrix = gl.getUniformLocation(shaderProgram,'normalMatrix');
	u_projectionMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
	
	// FRAGMENT SHADER

	u_intensidad_ambiente=gl.getUniformLocation(shaderProgram,"intensidad_ambiente");
	u_intensidad_difusa=gl.getUniformLocation(shaderProgram,"intensidad_difusa");
	u_func_atenuacion=gl.getUniformLocation(shaderProgram,"func_atenuacion");
	u_ka=gl.getUniformLocation(shaderProgram,"ka");
	u_kd=gl.getUniformLocation(shaderProgram,"kd");
	u_ks=gl.getUniformLocation(shaderProgram,"ks");
	u_n=gl.getUniformLocation(shaderProgram,"n");

	//Para el planeta
	let vertexAttributeInfoArray = [
		new VertexAttributeInfo(positions, posLocation, 3),
		new VertexAttributeInfo(normals, normalLocation, 3)
	];
	//Para el satelite
	let vertexAttributeInfoArray2 = [
		new VertexAttributeInfo(positions2, posLocation, 3),
		new VertexAttributeInfo(normals2, normalLocation, 3)
	];
	//Para el anillo interior
	let vertexAttributeInfoArray3 = [
		new VertexAttributeInfo(positions3, posLocation, 3),
		new VertexAttributeInfo(normals3, normalLocation, 3)
	];
	//Para el anillo exterior
	let vertexAttributeInfoArray4 = [
		new VertexAttributeInfo(positions4, posLocation, 3),
		new VertexAttributeInfo(normals4, normalLocation, 3)
	];
	/*Creacion de VAOS*/
	vao = VAOHelper.create(indices, vertexAttributeInfoArray);//Creo el vao del planeta
	vao2= VAOHelper.create(indices2, vertexAttributeInfoArray2);//Creo el vao del satelite
	vao3= VAOHelper.create(indices3, vertexAttributeInfoArray3);//Creo el vao del anillo interior
	vao4= VAOHelper.create(indices4, vertexAttributeInfoArray4);//Creo el vao del anillo exterior
	gl.clearColor(0.05, 0.05, 0.05, 1.0); //Cambio el color de fondo
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	/*Creacion de camara*/
	camaraEsferica= new sphericalCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[5]),3,target,up);
	viewMatrix=camaraEsferica.createViewMatrix();//Calculo la matriz de vista
	let fov = glMatrix.toRadian(angle[3]); //Establezco el campo de vision inicial
	let aspect = canvas.width / canvas.height;//Establezco la relacion de aspecto
	let near = 0.1;//Establezco la distancia minima que renderizare
	let far = 10.0;//Establezco la distancia maxima que renderizare
	projectionMatrix=camaraEsferica.createPerspectiveMatrix(fov,near,far,aspect);//Calculo la matriz de proyeccion
	gl.enable(gl.DEPTH_TEST);//Activo esta opcion para que dibuje segun la posicion en Z. Si hay dos fragmentos con las mismas x,y pero distinta zIndex
	//Dibujara los que esten mas cerca de la pantalla.
	requestAnimationFrame(onRender)//Pido que inicie la animacion ejecutando onRender
}

/*Reordeno valores para dibujarlos como lineas	
	La idea es que si tengo el triangulo con vertices (0,0,0) (1,1,0) (-1,1,0)
	debo unirlos de la siguiente manera: (0,0,0) (1,1,0) , (0,0,0) (-1,1,0) , (-1,1,0) (1,1,0)
	para dibujarlos como lineas. Es decir, establezco el punto inicial y el punto final.
*/			
function convertIndexes(indexes){
	let newIndexes = [];
	for (let x = 0; x < indexes.length; x = x + 3) {
		//Linea 1
		newIndexes.push(indexes[x]);
		newIndexes.push(indexes[x + 1]);
		//Linea 2
		newIndexes.push(indexes[x + 1]);
		newIndexes.push(indexes[x + 2]);
		//Linea 3. Tiene que ser asi para respetar el sentido antihorario
		newIndexes.push(indexes[x + 2]);
		newIndexes.push(indexes[x]);
	}
	return newIndexes;
}

/*Este metodo se llama constantemente gracias al metodo requestAnimationFrame(). En los sliders no 
se llama al onRender, sino que unicamente actualiza valores. Luego el onRender recupera esos valores y transforma 
los objetos como corresponda.*/
function onRender(now) {
	now *= 0.001; //Tiempo actual
	var deltaTime = now - then; //El tiempo que paso desde la ultima llamada al onRender y la actual
	then = now; //Actualizo el valor 
	refreshAngles(deltaTime); //Actualizo los angulos teniendo en cuenta el desfasaje de tiempo
	/*Reinicio Matrices*/
	planetMatrix = mat4.create(); //Reinicio la matriz de planeta
	satelliteMatrix = mat4.create(); //Reinicio la matriz de satelite
	ring1Matrix = mat4.create(); //Reinicio la matriz del anillo 1
	ring2Matrix = mat4.create(); //Reinicio la matriz del anillo 2
	/*Actualizo las transformaciones para cada uno de los objetos*/
	rotatePlanet();//Roto el planeta
	rotateSatellite();//Roto el satelite
	orbitSatellite();//Orbito el satelite
	scaleSatellite();//Escalo el satelite
	scalePlanet();//Escalo el planeta
	rotateRing1();//Roto el anillo interior
	rotateRing2();//Roto el anillo exterior
	scaleRing1();//Escalo el anillo 1
	scaleRing2();//Escalo el anillo 2
	/*--------------------------Control de camara --------------------------*/
	if(animated[5]) //Si esta rotando automaticamente a la izquierda...
		viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(rotationAngle[5]),glMatrix.toRadian(angle[4])); //Roto segun el angulo de rotacion 5
	else
		if(animated[6]) //Si esta rotando automaticamente a la derecha...
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(rotationAngle[6]),glMatrix.toRadian(angle[4])); //Roto segun el angulo de rotacion 6
		else {// Si no esta siendo animada
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(angle[5]),glMatrix.toRadian(angle[4])); //Roto segun el angulo del slider
		}
	projectionMatrix=camaraEsferica.zoom(angle[3]);//Vuelvo a calcular la matriz de proyeccion (Perspectiva)
	
	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shaderProgram);

	// planeta

	gl.uniform3f(u_posL, 10.0,10.0,10.0);
	gl.uniform3f(u_intensidad_ambiente, 1.0,1.0,1.0);
	gl.uniform3f(u_intensidad_difusa, 1.0,1.0,1.0);
	gl.uniform1f(u_func_atenuacion, 1.0);
	gl.uniform3f(u_ka,0.21,0.13,0.05);
	gl.uniform3f(u_kd,0.71,0.43,0.18);
	gl.uniform3f(u_ks,0.39,0.27,0.17);
	gl.uniform1f(u_n, 25.6);
	gl.uniformMatrix4fv(u_planetMatrix, false, planetMatrix);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);

	mat4.multiply(normalMatrixPlanet,viewMatrix, planetMatrix);
	mat4.invert(normalMatrixPlanet,normalMatrixPlanet);
	mat4.transpose(normalMatrixPlanet,normalMatrixPlanet);
	gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrixPlanet);

	gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix);
	gl.bindVertexArray(vao);//Asocio el vao del planeta
	gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_INT, 0);//Dibuja planeta
	
	// satélite

	gl.bindVertexArray(null);
	gl.uniform3f(u_ka,0.17,0.01,0.01);
	gl.uniform3f(u_kd,0.61,0.04,0.04);
	gl.uniform3f(u_ks,0.73,0.63,0.63);
	gl.uniformMatrix4fv(u_satelliteMatrix, false, satelliteMatrix)

	mat4.multiply(normalMatrixSatellite,viewMatrix, satelliteMatrix);
	mat4.invert(normalMatrixSatellite,normalMatrixSatellite);
	mat4.transpose(normalMatrixSatellite,normalMatrixSatellite);
	gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrixSatellite);

	gl.bindVertexArray(vao2);//Asocio el vao del satelite
	gl.drawElements(gl.TRIANGLES, indexCount2, gl.UNSIGNED_INT, 0);//Dibuja satelite
	
	// anillo 1 

	gl.uniformMatrix4fv(u_ring1Matrix, false, ring1Matrix);
	gl.bindVertexArray(vao3);//Asocio el vao del anillo 1
	gl.uniform3f(u_ka,0.10,0.19,0.17);
	gl.uniform3f(u_kd,0.40,0.74,0.70);
	gl.uniform3f(u_ks,0.30,0.31,0.31);

	mat4.multiply(normalMatrixRing1,viewMatrix, ring1Matrix);
	mat4.invert(normalMatrixRing1,normalMatrixRing1);
	mat4.transpose(normalMatrixRing1,normalMatrixRing1);
	gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrixRing1);

	gl.drawElements(gl.TRIANGLES, indexCount3, gl.UNSIGNED_INT, 0);//Dibuja anillo 1
	
	// anillo 2

	gl.bindVertexArray(null);
	gl.uniformMatrix4fv(u_ring2Matrix, false, ring2Matrix);
	gl.bindVertexArray(vao4);//Asocio el vao del anillo 2

	mat4.multiply(normalMatrixRing2,viewMatrix, ring2Matrix);
	mat4.invert(normalMatrixRing2,normalMatrixRing2);
	mat4.transpose(normalMatrixRing2,normalMatrixRing2);
	gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrixRing2);

	gl.drawElements(gl.TRIANGLES, indexCount4, gl.UNSIGNED_INT, 0);//Dibuja anillo 2
	

	gl.bindVertexArray(null);
	gl.bindVertexArray(null);
	gl.useProgram(null);
	requestAnimationFrame(onRender); //Continua el bucle
}

/*Funcion para refrescar los angulos de rotacion automatica*/
function refreshAngles(deltaTime){
	 // A partir del tiempo que pasó desde el ultimo frame (timeDelta), calculamos los cambios que tenemos que aplicar al cubo
	for(let x = 0; x<10 ; x++){
		if(animated[x]){
			if(x==1){ //Si lo que se esta animando es el satelite
				rotationAngle[x] = -deltaTime * rotationSpeed+rotationAngle[x];//Acomodo el angulo de rotacion
				if(rotationAngle[x]<-360) //Verifico que no se pase de los valores establecidos para el slider
					rotationAngle[x]=360; //No hay problema alguno en que se pase, pero si se deja mucho tiempo corriendo
				if(rotationAngle[x]>360) //Puede llegar al maximo valor de integer y pueden llegar a ocurrir errores
					rotationAngle[x]=-360;
			}
			else
			if(x==6){ //Si lo que se esta animando es la camara rotando automaticamente de forma horaria
				rotationAngle[x] = deltaTime * (-rotationSpeed)+rotationAngle[x]; 
				if(rotationAngle[x]<=0)
					rotationAngle[x]=360;
			}
			else 
			 if(x==5){//Si lo que estoy animando es la camara rotando automaticamente de forma antihoraria
				rotationAngle[x] = deltaTime * rotationSpeed + rotationAngle[x];				
				if(rotationAngle[x]>360)
					rotationAngle[x]=0;
			}
			else
				if(x==7){//Si lo que estoy animando es el planeta rotando automaticamente de forma horaria
				rotationAngle[x] =deltaTime * (-rotationSpeed) + rotationAngle[x];				
				if(rotationAngle[x]<-360)
					rotationAngle[x]=360;
				if(rotationAngle[x]>360)
					rotationAngle[x]=-360;
			}
			else{//Si no es ninguno de los casos anteriores establezco un angulo de rotacion estandar
				rotationAngle[x] = deltaTime * rotationSpeed + rotationAngle[x];				
				if(rotationAngle[x]>360)
					rotationAngle[x]=-360;
			}
		}
	}
}

/*Funcion para rotar el anillo interior*/
function rotateRing1(){
	let escalar1Y = 2; //Establezco el valor del escalar por el cual multiplicare al angulo de rotacion segun Y
	let escalar1Z = -1; //Establezco el valor del escalar por el cual multiplicare al angulo de rotacion segun Z
	let rotationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de rotacion
	if(animated[0]){ //Si el planeta esta siendo animado...
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(escalar1Y * rotationAngle[0]));//Roto con respecto a Y con el angulo de rotacion 
		mat4.multiply(ring1Matrix, rotationMatrix, ring1Matrix); //Aplico la rotacion
		mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(escalar1Z * rotationAngle[0])); //Roto con respecto a Z con el angulo de rotacion
	}else
		if(animated[7]){ //Si el planeta esta siendo animado...
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(escalar1Y * rotationAngle[7]));//Roto con respecto a Y con el angulo de rotacion 
		mat4.multiply(ring1Matrix, rotationMatrix, ring1Matrix);//Aplico Rotacion
		mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(escalar1Z * rotationAngle[7]));//Roto con respecto a Z con el angulo de rotacion
	}
	else{ //Sino...
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(escalar1Y * angle[0]));//Roto con respecto a Y con el angulo del slider
		mat4.multiply(ring1Matrix, rotationMatrix, ring1Matrix);//Aplico la rotacion
		mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(escalar1Z * angle[0]));//Roto con respecto a Z con el angulo del slider
	}
	mat4.multiply(ring1Matrix, rotationMatrix, ring1Matrix);//Aplico rotacion y escalo
	let anguloX1 = 62;//Establezco el valor del escalar por el cual multiplicare al angulo de rotacion segun X
	mat4.fromXRotation(rotationMatrix, glMatrix.toRadian(anguloX1));//Roto con respecto a X
	mat4.multiply(ring1Matrix, rotationMatrix, ring1Matrix);//Aplico la rotacion
}

/*Funcion para rotar el anillo exterior*/
function rotateRing2(){
	let escalar2Y = -1; //Establezco el valor del escalar por el cual multiplicare al angulo de rotacion segun Y
	let escalar2Z = 1; //Establezco el valor del escalar por el cual multiplicare al angulo de rotacion segun Z
	let rotationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de rotacion
	if(animated[0]){ //Si el planeta esta siendo animado...
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(escalar2Y * rotationAngle[0]));//Roto con respecto a Y con el angulo de rotacion 
		mat4.multiply(ring2Matrix, rotationMatrix, ring2Matrix);//Aplico Rotacion
		mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(escalar2Z * rotationAngle[0]));//Roto con respecto a Z con el angulo de rotacion
	}
	else
		if(animated[7]){ //Si el planeta esta siendo animado...
			mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(escalar2Y * rotationAngle[7]));//Roto con respecto a Y con el angulo de rotacion 
			mat4.multiply(ring2Matrix, rotationMatrix, ring2Matrix);//Aplico Rotacion
			mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(escalar2Z * rotationAngle[7]));//Roto con respecto a Z con el angulo de rotacion
		}
		else{ //Sino...
			mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(escalar2Y * angle[0]));//Roto con respecto a Y con el angulo del slider
			mat4.multiply(ring2Matrix, rotationMatrix, ring2Matrix);//Aplico Rotacion
			mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(escalar2Z * angle[0]));//Roto con respecto a Z con el angulo del slider
		}
	mat4.multiply(ring2Matrix, rotationMatrix, ring2Matrix);//Aplico la rotacion
	let anguloX2 = 21; //Establezco el valor del escalar por el cual multiplicare al angulo de rotacion segun X
    mat4.fromXRotation(rotationMatrix, glMatrix.toRadian(anguloX2));//Roto con respecto a X
	mat4.multiply(ring2Matrix, rotationMatrix, ring2Matrix);//Aplico la rotacion
}

/*Funcion para rotar el planeta*/
function rotatePlanet(){
	let rotationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de rotacion
	let translationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de traslacion
	if(animated[0])//Si esta siendo animado...
		//Creo matriz de rotacion para el planeta con el angulo de rotacion automatico
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(rotationAngle[0]));
		else
			if(animated[7])//Si esta siendo animado...
				//Creo matriz de rotacion para el planeta con el angulo de rotacion automatico
				mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(rotationAngle[7]));
			else//sino... creo matriz de rotacion con el angulo del slider
				mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(angle[0]));
	//Aplico transformaciones al planeta 
	mat4.multiply(planetMatrix, rotationMatrix, planetMatrix);	
}

/*Funcion para escalar el anillo interior*/
function scaleRing1(){
	let scaleMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de escalado
	let scale = [0.079,0.079,0.079];//Seteo el vector de escalado
	mat4.fromScaling(scaleMatrix,scale);//Creo la matriz de escalado
	mat4.multiply(ring1Matrix, scaleMatrix, ring1Matrix);//Aplico escalado
}

/*Funcion para escalar el anillo exterior*/
function scaleRing2(){
	let scaleMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de escalado
	let scale = [0.1,0.1,0.1];//Setep el vector de escalado
	mat4.fromScaling(scaleMatrix,scale);//Creo la matriz de escalado
	mat4.multiply(ring2Matrix, scaleMatrix, ring2Matrix);//Aplico escalado
}

/*Funcion para rotar el satelite*/
function rotateSatellite(){
	let rotationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de rotacion
	let translationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de traslacion
	if(animated[1])//Si esta siendo animado
		//Creo matriz de rotacion para el satelite
		mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(rotationAngle[1]));
		else
			if(animated[8])
				mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(rotationAngle[8]));
	else//Sino... creo matriz de rotacion con el angulo del slider
		mat4.fromZRotation(rotationMatrix, glMatrix.toRadian(-angle[1]));
	//Obtengo las componentes del punto central de rotacion del objeto y multiplico por -1 para obtener 
	//el vector de traslacion al 0,0,0
	let vecTranslation =[-1*parseFloat(obj2center[0]),-1*parseFloat(obj2center[1]),-1*parseFloat(obj2center[2])];
	mat4.fromTranslation(translationMatrix,vecTranslation);//Creo matriz de traslacion
	mat4.multiply(satelliteMatrix,translationMatrix, satelliteMatrix);//Traslado el satelite al 0,0,0
	mat4.multiply(satelliteMatrix, rotationMatrix, satelliteMatrix);//Roto el satelite
	mat4.invert(translationMatrix,translationMatrix)//Calculo la matriz de traslacion al punto original
	mat4.multiply(satelliteMatrix,translationMatrix,satelliteMatrix);//Vuelvo a pos normal
}

/*Funcion para orbitar el satelite*/
function orbitSatellite(){
	let rotationMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de rotacion
	if(animated[2])//Si esta siendo animado... Creo matriz de rotacion en orbita para el satelite con el angulo de rot automatica
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(-rotationAngle[2]));
		else
	if(animated[9])
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(rotationAngle[9]));
	else//Sino... creo matriz de rotacion con el angulo del slider
		mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(-angle[2]));
	mat4.multiply(satelliteMatrix, rotationMatrix, satelliteMatrix);//Muevo al satelite por la orbita
}

/*Funcion para escalar el satelite*/
function scaleSatellite(){
	let scale = [0.09,0.09,0.09];//Creo el vector de escalado
	let scaleMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de escalado
	mat4.fromScaling(scaleMatrix,scale);//Creo la matriz de escalado
	mat4.multiply(satelliteMatrix, scaleMatrix, satelliteMatrix);//Aplico el escalado
}

/*Funcion para escalar el planeta*/
function scalePlanet(){
	let scale = [0.08,0.08,0.08];//Creo el vector de escalado
	let scaleMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de escalado
	mat4.fromScaling(scaleMatrix,scale);//Creo la matriz de escalado
	mat4.multiply(planetMatrix, scaleMatrix, planetMatrix);//Aplico el escalado
}

/*Funcion para cargar los objetos*/
function onModelLoad() {
	parsedOBJ = OBJParser.parseFile(planeta); //Cargo el planeta
	parsedOBJ2 = OBJParser.parseFile(satelite); //Cargo el satelite
	parsedOBJ3 = OBJParser.parseFile(anillo1); //Cargo el anillo interior
	parsedOBJ4 = OBJParser.parseFile(anillo2); //Cargo el anillo exterior
}
