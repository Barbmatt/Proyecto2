class Utils {
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
