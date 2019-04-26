/*Funcion para cargar los sliders de la pagina*/
function cargarSliders(){
	for(let i=0; i<6; i++){
		slider[i]=document.getElementById("slider"+(i+1));//Guardo el slider
		angle[i]=parseFloat(slider[i].defaultValue);//Actualizo el valor del angulo asociado al slider
		console.log("i "+i + " "+angle[i]);
		updateTextInput(i+1,slider[i].value);//Actualizo el valor del campo de texto asociado al slider
	}
	angle[3] = 91-slider[3].defaultValue; //Este es el angulo del slider del zoom
	//Debo cargarlo asi para que cuando aumente se acerque, y cuando disminuye se aleje
}

/*Funcion para el slider de rotacion del planeta*/
function onSliderRotationPlanet(slider) {
	angle[0] = parseFloat(slider.value);
	changed=true; //Marco que hubo un cambio, lo cual habilita el reset
	updateTextInput(1,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*Funcion para el slider de rotacion del satelite*/
function onSliderRotationSatellite(slider) {
	angle[1] = parseFloat(slider.value);
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	updateTextInput(2,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*Funcion para el slider de la orbita del satelite*/
function onSliderRotationSatellitePlanet(slider) {
	angle[2] = parseFloat(slider.value);
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
    updateTextInput(3,slider.value);//Actualizo el valor del campo de texto asociado al slider
	}

/*Funcion para el slider de rotacion de la camara*/
function onSliderRotationCamera(slider) {
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	angle[5] = parseFloat(slider.value);
	updateTextInput(6,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*Funcion para el slider de zoom de la camara*/
function onSliderZoomCamera(slider) {
	let delta = parseFloat(slider.value);
	angle[3] = 91-delta;
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	updateTextInput(4,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*funcion para el slider de los movimientos hacia arriba y hacia abajo de la camara*/
function onSliderUpDownCamera(slider){
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	angle[4] = parseFloat(slider.value);
	updateTextInput(5,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*Funcion para actualizar el valor en el textField*/
function updateTextInput(num,val) {
    document.getElementById("textInput"+num).value=val; 
}

//TODO: CAMBIAR VARIABLES POR ARREGLO
/*Funcion para setear nuevo valor al slider desde el textField*/
function setNewValue(num,value){
	//Si no es la cadena nula
	if(value!=""){
		//Convierto a float
		value=parseFloat(value);
		//Si no es un numero....
		if(Number.isNaN(value))
			value=0;
		if(num==1){
			slider1.value=value;
			onSliderRotationPlanet(slider1);
		}
		if(num==2){
			slider2.value=value;
			onSliderRotationSatellite(slider2);
		}
		if(num==3){
			slider3.value=value;
			onSliderRotationSatellitePlanet(slider3);
		}
		if(num==4){
			slider4.value=value;
			onSliderZoomCamera(slider4);
		}
		if(num==5){
			slider5.value=value;
			onSliderUpDownCamera(slider5);
		}
		if(num==6){
			slider6.value=value;
			onSliderRotationCamera(slider6);
		}
	}
}

/*Funcion usada para animar*/
/*Funcionamiento: Se pasa al metodo un indice, el cual indica que boton se ha pulsado
y que accion debe llevar a cabo... 
*/
function animateObject(index){
	changed=true; //Activo que hubo un cambio
	if(!animated[index]){ //Si no estaba siendo animado...
		animated[index]=true; //Lo animo
		rotationAngle[index] = parseFloat(angle[index]); //Tomo el valor del angulo correspondiente y lo asigno al angulo de rotacion automatica
		if(index==0){//Si estoy animando el planeta rotando de forma antihoraria
			if(animated[7]) //Si estaba rotando de manera horaria
				animateObject(7); //Termino la animacion anterior
			rotationAngle[0]=parseFloat(angle[0]); //Actualizo el valor
		}
		if(index==1){//Si se trata del satelite rotando horario
			if(animated[8]) //Si estaba rotando antihorario
				animateObject(8); //Termino la animacion anterior
			rotationAngle[1]=-parseFloat(angle[1]) //Debo multiplicar por -1 el valor del angulo para que rote horario
		}
		if(index==2){//Si se trata del satelite orbitando horario
			if(animated[9])//Si estaba orbitando antihorario
				animateObject(9);//Termino la animacion anterior
			rotationAngle[2]=parseFloat(angle[2]); //Tomo el angulo del slider 2
		}
		if(index==5){//Si se trata de la rotacion automatica de la camara antihorario
			if(animated[6])//Si estaba rotando automaticamente horario
				animateObject(6);//Termino la animacion anterior
			rotationAngle[5]=parseFloat(angle[5]); //Tomo el angulo del slider 5
		}
		if(index==6){ //Si se trata de la rotacion automatica de la camara horario
			if(animated[5])//Si estaba rotando automaticamente antihorario
				animateObject(5);//Termino la animacion anterior
			rotationAngle[6]=parseFloat(angle[5]); //Tomo el angulo del slider 5
		}
		if(index==7){//Si se trata del planeta rotando horario
			if(animated[0])//Si estaba rotando de manera antihoraria
				animateObject(0);//Termino la animacion anterior
			rotationAngle[7]=parseFloat(angle[0]); //Tomo el angulo del slider 0
		}
		if(index==8){//Si se trata del satelite rotando antihorario
			if(animated[1])//Si estaba rotando de manera horaria
				animateObject(1);//Termino la animacion anterior
			rotationAngle[8]=-parseFloat(angle[1]); //Tomo el angulo del slider 1
		}
		if(index==9){//Si se trata del satelite orbitando antihorario
			if(animated[2])//Si estaba orbitando de manera horaria
				animateObject(2);//Termino la animacion anterior
			rotationAngle[9]=-parseFloat(angle[2]); //Tomo el angulo del slider 2
		}
		
	}
	else { //Si ya se encontraba animandose, deseo pararlo
		animated[index]=false; //Termino la animacion
		if(index==1){ //Si era el satelite
			slider[1].value=-rotationAngle[1]; //Seteo el valor del slider como -1 por el angulo de rotacion que haya quedado.
			angle[1] = -rotationAngle[1]; //Seteo el valor del angulo de la misma manera
			updateTextInput(2,-rotationAngle[1]); //Actualizo el valor del campo de texto asociado
		}
		else //Tengo que hacer un caso especial en el 6 porque comparte el slider 5 y no existe slider 6, por lo tanto el caso general falla.
		if(index==6){ //Si se trata de la rotacion automatica de la camara a la derecha
			slider[5].value=rotationAngle[6]; //Seteo el valor del slider 5 como el angulo de rotacion 6
			angle[5] = rotationAngle[6]; //Hago lo mismo con el angulo
			updateTextInput(6,rotationAngle[6]); //Y con el campo de texto
		}else
			if(index==7){
				slider[0].value = rotationAngle[7];
				angle[0] = rotationAngle[7];
				updateTextInput(1,rotationAngle[7]);
			}
			else
				if(index==8){
					slider[1].value = -rotationAngle[8];
					angle[1] = -rotationAngle[8];
					updateTextInput(2,-rotationAngle[8]);
				}
				else
					if(index==9){
						slider[2].value = -rotationAngle[9];
						angle[2] = -rotationAngle[9];
						updateTextInput(3,-rotationAngle[9]);
					}
					else{ //Sino, en el caso general....
						slider[index].value=rotationAngle[index]; //Asigno al slider asociado con el valor de rotacion asociado
						angle[index]=rotationAngle[index]; //Lo mismo con el angulo
						updateTextInput(index+1,rotationAngle[index]); //Lo mismo con el campo de texto
					}
	}
}

/*Funcion para resetear la escena.*/
function resetScene(){
	if(changed){ //Si ha habido algun cambio...
		//El 6 esta afuera porque es un caso especial.Corresponde a la rotacion de la camara automatica a la derecha
		animated[6]=false; //Seteo todas las animaciones en falso
		rotationAngle[6]=slider[5].defaultValue; //Seteo los valores de los angulos a los iniciales de cada slider
		animated[7]=false; //Seteo todas las animaciones en falso
		rotationAngle[7]=slider[0].defaultValue; //Seteo los valores de los angulos a los iniciales de cada slider
		animated[8]=false; //Seteo todas las animaciones en falso
		rotationAngle[8]=slider[1].defaultValue; //Seteo los valores de los angulos a los iniciales de cada slider
		animated[9]=false; //Seteo todas las animaciones en falso
		rotationAngle[9]=slider[2].defaultValue; //Seteo los valores de los angulos a los iniciales de cada slider
		for(let x=0; x<6; x++){
			animated[x]=false;
			rotationAngle[x]=slider[x].defaultValue;
			angle[x]=slider[x].defaultValue;
			updateTextInput(x+1,slider[x].defaultValue);
			if(slider[x]!=null)
				slider[x].value=slider[x].defaultValue;
		}
		//El 3 tambien. Corresponde al zoom
		angle[3]= 91-slider[3].defaultValue;
		changed=false;//Marco que no hay ningun cambio
		updateTextInput(4,slider[3].defaultValue);
	}
	console.log("RESET");//Escribo un RESET para avisar que hizo algo
}

/*Funcion usada para poner en pantalla completa*/
function launchFullScreen(element) {
	if(!fullScreen){ //Si no esta en pantalla completa...
		if(element.requestFullScreen) //Opcion estandar
			element.requestFullScreen();
		else 
			if(element.mozRequestFullScreen) //Opcion para Gecko (Firefox)
				element.mozRequestFullScreen();
			else 
				if(element.webkitRequestFullScreen) //Opcion para Blink (Chrome,Opera,Edge)
					element.webkitRequestFullScreen();
		fullScreen=true; //Esta en pantalla completa
	}
	else{ //Si estaba en pantalla completa
		if(document.cancelFullScreen) 
			document.cancelFullScreen();
		else 
			if(document.mozCancelFullScreen) 
				document.mozCancelFullScreen();
			else 
				if(document.webkitCancelFullScreen) 
					document.webkitCancelFullScreen();		
	 fullScreen=false; //Ya no lo esta
	}
}
