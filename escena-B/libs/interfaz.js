// clase apuntada a la manipulación de los distintos componentes de la interfaz html

class interfaz {

	static deshabilitar_sliders_camara_reset(value) {
		document.getElementById("range_paneo").disabled = value;
		document.getElementById("range_zoom").disabled = value;
		document.getElementById("range_altura").disabled = value;
		document.getElementById("boton_reset").disabled = value;
	}

	static deshabilitar_sliders_movimientos_reset_select(value) {
		document.getElementById("range_casa").disabled = value;
		document.getElementById("range_cohete").disabled = value;
		document.getElementById("range_orbita").disabled = value;
		document.getElementById("camara_seleccionada").disabled = value;
	}

	// retorna 'a' si la cámara seleccionada es "Automática" y 'm' si es "Manual"
	static camara_seleccionada() {
		let select_camara = document.getElementById("camara_seleccionada");
		let camara_seleccionada = select_camara.options[select_camara.selectedIndex].text;
		// camara_seleccionada nada más puede ser Manual o Automática. basta con controlar un valor posible
		let resultado;
		if ( camara_seleccionada == "Manual" ) resultado = 'm'
		else resultado = 'a';
		return resultado;
	}

	static setear_valores_sliders_camara(paneo, zoom, altura) {
        document.getElementById("range_paneo").value = paneo;
        document.getElementById("range_zoom").value = zoom;
        document.getElementById("range_altura").value = altura;
	}
}