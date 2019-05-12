class Ward3 {

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion_luz = this.gl.getUniformLocation(this.shader_program,'posL');

        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');

        this.u_ia = this.gl.getUniformLocation(this.shader_program,'ia');

        this.u_ka = this.gl.getUniformLocation(this.shader_program,'ka');
        this.u_kd = this.gl.getUniformLocation(this.shader_program,'kd');
        this.u_ks = this.gl.getUniformLocation(this.shader_program,'ks');
        this.u_n = this.gl.getUniformLocation(this.shader_program,'n');
    }

    set_luz(luz) {
        let pos_luz = luz.posL;
        let ia = luz.intensidad;
        this.gl.uniform3f(this.u_ia, ia[0], ia[1], ia[2]);
        this.gl.uniform3f(this.u_posicion_luz, pos_luz[0], pos_luz[1], pos_luz[2]);
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

        uniform vec3 posL;

        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 vi;
        out vec3 vn;
        out vec3 vr;

        void main() {
            vec3 p = vec3(viewMatrix * modelMatrix *vec4(vertexPosition, 1));
            vi = vec3(viewMatrix * vec4(posL,1));
            vi = vi - p;
            vr = -p;
            vn = vec3(normalMatrix*vec4(vertexNormal,1));
            vi = normalize(vi);
            vn = normalize(vn);
            vr = normalize(vr);

            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment(){
        return  `#version 300 es
        precision mediump float;

        uniform vec3 ia;

        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float n;

        in vec3 vi;
        in vec3 vn;
        in vec3 vr;
        out vec4 fragmentColor;

        void main() {
            vec3 vni = normalize(vi);
            vec3 vnn = normalize(vn);
            vec3 vnr = normalize(vr);
            vec3 vnh = normalize(vr+vi);

            float cos_ti = dot(vnn,vni);
            float cos_tr = dot(vnn,vnr);

            float tita_h = acos(dot(vnh,vnn));

            vec3 color = ia*ka;

            if ( cos_ti > 0.0 && cos_tr > 0.0 ) {
                float PI = 3.14159;
                float tangente = tan(tita_h);
                float n2 = n*n;
                float divisor = 4.0*PI*n2;
                float exp_aux = exp(-tangente*tangente/n2)/divisor;
                color += kd/PI + exp_aux * ks/sqrt(cos_ti*cos_tr);
            }
            else {
                color += kd*cos_ti + ks*cos_tr;
            }
            fragmentColor = vec4(color,1);
        }
        ` ;
    }
}
