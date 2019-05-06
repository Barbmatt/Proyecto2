class Model {
	constructor(objectSource, ka, kd, ks, n, loc_posicion, loc_normal) {
		this.material = [ka,kd,ks,n];

		this.parsedOBJ = OBJParser.parseFile(objectSource);
		this.indices = this.parsedOBJ.indices;
		this.positions = this.parsedOBJ.positions;
		this.normals = this.parsedOBJ.normals;
		// en un futuro se tendria que pasar las texturas tambien
		
		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(this.positions, loc_posicion, 3),
			new VertexAttributeInfo(this.normals,loc_normal,3)
		];
	
		this.vao = VAOHelper.create(this.indices, vertexAttributeInfoArray);
	}
}