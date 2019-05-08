class Color_posicion {

    constructor(vertexShaderSource, fragmentShaderSource) {
        this.shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

        this.u_matriz_vista = gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_modelo = gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_posicion = gl.getAttribLocation(this.shader_program, 'vertexPosition');
    }
    
}