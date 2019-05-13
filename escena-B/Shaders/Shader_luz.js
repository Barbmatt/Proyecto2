class Shader_luz {

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_intensidad = this.gl.getUniformLocation(this.shader_program, 'intensidad');

        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
    }
    
    set_luz(intensidad) { this.gl.uniform3f(this.u_intensidad, intensidad[0], intensidad[1], intensidad[2]); }

    vertex() {
        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 projectionMatrix;
    
        in vec3 vertexPosition;
    
        void main() {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        
        `;
    }

    fragment(){

        return `#version 300 es
        precision mediump float;

        uniform vec3 intensidad;
        
        out vec4 fragmentColor;

        void main(){
            fragmentColor = vec4(intensidad,1);
        }
        `;
    }
}