class Phong {

    constructor(gl) {
        this.gl = gl;

        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion = this.gl.getUniformLocation(this.shader_program,'posicion');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,'intensidad_ambiente');
        this.u_intensidad = this.gl.getUniformLocation(this.shader_program,'intensidad');
        this.u_atenuacion = this.gl.getUniformLocation(this.shader_program,'atenuacion');

        this.u_constante_ambiente = this.gl.getUniformLocation(this.shader_program,"ka");
        this.u_constante_difusa = this.gl.getUniformLocation(this.shader_program,"kd");
        this.u_constante_especular = this.gl.getUniformLocation(this.shader_program,"ks");
        this.u_brillo = this.gl.getUniformLocation(this.shader_program,"n");
    }

    set_luz(luz, ambiente) {
        let posicion = luz.posicion;
        let atenuacion = luz.atenuacion;
        let intensidad = luz.intensidad;
        this.gl.uniform3f(this.u_intensidad, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_atenuacion, atenuacion[0], atenuacion[1], atenuacion[2]);
        this.gl.uniform3f(this.u_posicion, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_intensidad_ambiente, ambiente[0], ambiente[1], ambiente[2]);
    }

    set_material(material) {
        let ka = material.ka;
        let ks = material.ks;
        let kd = material.kd;
        let n = material.n;
        this.gl.uniform3f(this.u_constante_ambiente,ka[0],ka[1],ka[2]);
        this.gl.uniform3f(this.u_constante_difusa,kd[0],kd[1],kd[2]);
        this.gl.uniform3f(this.u_constante_especular,ks[0],ks[1],ks[2]);
        this.gl.uniform1f(this.u_brillo,n);
    }

    vertex() {
        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 normalMatrix;
        uniform mat4 modelMatrix;

        uniform vec3 posicion;

        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 normal;
        out vec3 luz;
        out vec3 ojo;


        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(posicion,1));
            luz = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto

            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment() {
        return `#version 300 es
        precision mediump float;

        uniform vec3 intensidad_ambiente;

        uniform vec3 intensidad;
        uniform vec3 atenuacion;

        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float n;

        in vec3 normal;
        in vec3 luz;
        in vec3 ojo;

        out vec4 fragmentColor;

        void main() {
            vec3 N = normalize(normal);
            vec3 L = normalize(luz);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);

            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt( L.x*L.x + L.y*L.y + L.y*L.y );
            float fa = 1.0/(1.0 + atenuacion.x*d + atenuacion.y*d + atenuacion.z*d*d);
            vec3 luz = intensidad_ambiente*ka + fa*intensidad*(kd*NL + ks*NHn);
            fragmentColor = vec4(luz,1);

        }
        `;
    }

}
