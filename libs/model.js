class Model {
	constructor(objectSource) {
		this.source = objectSource;
		this.vao_= null; 
		this.cant_indices=0;
	}

	generateModel(pos_location,normal_location) {
		let parsedOBJ = OBJParser.parseFile(this.source);
		let indices = parsedOBJ.indices;
		this.cant_indices = indices.length;
		let positions = parsedOBJ.positions;
		let normals =parsedOBJ.normals;
		// en un futuro se tendria que pasar las texturas tambien
		
		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(positions, this.pos_location, 3),
			new VertexAttributeInfo(normals,this.normal_location,3)
		];
	
		this.vao = VAOHelper.create(indices, vertexAttributeInfoArray);
	
		//Ya tengo los buffers cargados en memoria de la placa grafica
		//parsedOBJ = null;
	}

	draw( gl,u_modelMatrix,matriz_model,matriz_normal,ka,kd,ks,n) {
		
		gl.uniform3f(u_constante_ambiente,ka[0],ka[1],ka[2]);
		gl.uniform3f(u_constante_difusa,kd[0],kd[1],kd[2]);
		gl.uniform3f(u_constante_especular,ks[0],ks[1],ks[2]);
		gl.uniform1f(u_brillo,n);
		gl.uniformMatrix4fv(u_modelMatrix, false,matriz_model);
		mat4.multiply(matriz_normal,camara.vista(),matriz_model);
		mat4.invert(matriz_normal,matriz_normal);
		mat4.transpose(matriz_normal,matriz_normal);
		gl.uniformMatrix4fv(u_matriz_normal, false, matriz_normal);

		// dibujo los objetos por triangulos
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.cant_indices, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}

}