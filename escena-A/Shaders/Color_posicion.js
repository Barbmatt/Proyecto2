class Color_posicion {

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_intensidad = this.gl.getUniformLocation(this.shader_program, 'intensidad');

        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
    }
    
    vertex() {
        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 projectionMatrix;
    
        uniform vec3 intensidad;

        in vec3 vertexPosition;
        out vec3 color;
    
        void main() {
            color = intensidad;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        
        `;
    }

    fragment(){

        return `#version 300 es
        precision mediump float;

        in vec3 color;
        out vec4 fragmentColor;

        void main(){
            fragmentColor = vec4(color,1);
        }
        `;
    }
}