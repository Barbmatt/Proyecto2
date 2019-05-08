class Model {
	constructor(objectSource, material, loc_posicion, loc_normal) {
		this.material = material;

		this.parsedOBJ = OBJParser.parseFile(objectSource);
		this.indices = this.parsedOBJ.indices;
		this.cant_indices = this.indices.length;
		this.positions = this.parsedOBJ.positions;
		this.normals = this.parsedOBJ.normals;
		// en un futuro se tendria que pasar las texturas tambien
		
		let vertexAttributeInfoArray = null;

		if ( loc_normal != null )
			vertexAttributeInfoArray = [
				new VertexAttributeInfo(this.positions, loc_posicion, 3),
				new VertexAttributeInfo(this.normals, loc_normal, 3)
			];
		else
			vertexAttributeInfoArray = [
				new VertexAttributeInfo(this.positions, loc_posicion, 3)
			];
	
		this.vao = VAOHelper.create(this.indices, vertexAttributeInfoArray);
	}
}