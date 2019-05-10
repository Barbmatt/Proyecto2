class Utils {

	// setea el color de todos los componentes de un arreglo en función de la posición
	static pintar_con_posiciones(posiciones) {
		let i = 0, length = posiciones.length;
		let colors = new Array(length);
		while (i < length) colors[i] = posiciones[i++];
		return colors;
	}

	// setea el color de todos los componentes de un arreglo dada la variable color
	static pintar_con_color(length, color) {
		let colors = new Array(length);
		let i = 0;
		while (i < length) colors[i++] = color;
		return colors;
	}

	// transforma los índices de triángulos en índices de líneas
	static indices_triangulos_a_lineas(indices_T) {
		let indices_L = new Array(indices_T.length * 3);
		let pri, segu, terc, iT = 0, iL = 0;
		while (iT < indices_T.length) {
			pri = indices_T[iT++];
			segu = indices_T[iT++];
			terc = indices_T[iT++];
			indices_L[iL++] = pri; indices_L[iL++] = segu;
			indices_L[iL++] = segu; indices_L[iL++] = terc;
			indices_L[iL++] = terc; indices_L[iL++] = pri;
		}
		return indices_L;
	}

	static cartesianas_a_esfericas(cartesianas) {
		let x = cartesianas[0], y = cartesianas[1], z = cartesianas[2];
		let r,f,t;
		r = Math.sqrt(x*x + y*y + z*z);
		t = Math.atan(x/z);
		f = Math.acos(y/r);
		return [r,t,f];
	}

	static esfericas_a_cartesianas(esfericas) {
		let r = esfericas[0], t = esfericas[1], f = esfericas[2];
		let x,y,z;
		x = r * Math.sin(t) * Math.sin(f);
		y = r * Math.cos(t);
		z = r * Math.sin(t) * Math.cos(f);
		return [x,y,z];
	}

}
