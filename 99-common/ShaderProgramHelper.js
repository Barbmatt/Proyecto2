class ShaderProgramHelper {

	static create(vertexShaderSource, fragmentShaderSource, attributeBindings) {
		let vertexShader = ShaderProgramHelper._createShader(gl.VERTEX_SHADER, vertexShaderSource);
		let fragmentShader = ShaderProgramHelper._createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

		let shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		gl.validateProgram(shaderProgram);

		let success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
		if (!success) {
			let errorMsg = gl.getProgramInfoLog(shaderProgram);
			gl.deleteProgram(shaderProgram);
			throw 'Could not link program: ' + errorMsg;
		}
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		if (attributeBindings) {
			ShaderProgramHelper._bindAttributes(shaderProgram, attributeBindings);
		}
		return shaderProgram;
	}

	static _createShader(type, shaderSource) {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);

		let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!success) {
			let name = 'UNKNOW';
			if (type == gl.VERTEX_SHADER) {
				name = 'VERTEX';
			} else if (type == gl.FRAGMENT_SHADER) {
				name = 'FRAGMENT';
			}
			let errorMsg = gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw "Could not compile " + name + " shader: " + errorMsg;
		}
		return shader;
	}

	static _bindAttributes(shaderProgram, attributeBindings) {
		//Foreach binding do this:
		//gl.bindAttribLocation(this._shaderProgram, attributeIndex, variableName);
		throw "Not implemented yet!";
	}
}