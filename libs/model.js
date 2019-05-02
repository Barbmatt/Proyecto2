class Model {
	constructor(objectSource, ka, kd, ks, n) {
		this.source = objectSource;
		this.vao = null; 
		this.cant_indices=0;
		this.material = [ka,kd,ks,n];
	}

	generar_modelo(pos_location,normal_location) {
		let parsedOBJ = OBJParser.parseFile(this.source);
		let indices = parsedOBJ.indices;
		this.cant_indices = indices.length;
		let positions = parsedOBJ.positions;
		let normals = parsedOBJ.normals;
		// en un futuro se tendria que pasar las texturas tambien
		
		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(positions, pos_location, 3),
			new VertexAttributeInfo(normals,normal_location,3)
		];
	
		this.vao = VAOHelper.create(indices, vertexAttributeInfoArray);
	
		//Ya tengo los buffers cargados en memoria de la placa grafica
		//parsedOBJ = null;
	}
}