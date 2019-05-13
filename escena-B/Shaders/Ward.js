class Ward {

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion = this.gl.getUniformLocation(this.shader_program,'posicion');

        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,'intensidad_ambiente');
        this.u_intensidad = this.gl.getUniformLocation(this.shader_program,'intensidad');
        this.u_atenuacion = this.gl.getUniformLocation(this.shader_program,'atenuacion');

        this.u_ka = this.gl.getUniformLocation(this.shader_program,'ka');
        this.u_kd = this.gl.getUniformLocation(this.shader_program,'kd');
        this.u_ks = this.gl.getUniformLocation(this.shader_program,'ks');
        this.u_n = this.gl.getUniformLocation(this.shader_program,'n');
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
        let kd = material.kd;
        let ks = material.ks;
        let n = material.n;
        this.gl.uniform3f(this.u_ka,ka[0],ka[1],ka[2]);
        this.gl.uniform3f(this.u_kd,kd[0],kd[1],kd[2]);
        this.gl.uniform3f(this.u_ks,ks[0],ks[1],ks[2]);
        this.gl.uniform1f(this.u_n,n);
    }

    vertex(){

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
            vec3 p = vec3(viewMatrix * modelMatrix *vec4(vertexPosition, 1));
            luz = vec3(viewMatrix * vec4(posicion,1));
            luz = normalize(luz - p);
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-p);

            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment(){
        return  `#version 300 es
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
            vec3 V = normalize(ojo);
            vec3 N = normalize(normal);
            vec3 L = normalize(luz);
            vec3 H = normalize(ojo+L);

            float NL = max(dot(N,L),0.0);
            float NV = max(dot(N,V),0.0);
            float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
            float fa = 1.0/(1.0+atenuacion.x+atenuacion.y*d+atenuacion.z*d*d);

            vec3 color =  intensidad_ambiente*ka + fa*intensidad*kd*NL;

            if ( NL > 0.0 && NV > 0.0 ) {
           		float NH = max(dot(H,N),0.0);
                float NH2 = NH*NH;
            	float PI = 3.14159;
                float n2 = n*n;
                float tangente = (1.0 - NH2)/ NH2;
                float divisor = 4.0*PI*n2;
                float exp_aux = exp(-tangente*tangente/n2)/divisor;
                color += fa*intensidad*exp_aux * ks/sqrt(NL*NV);
            }

            fragmentColor = vec4(color,1);//* 1.5;
        }
        ` ;
    }
}
