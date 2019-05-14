class Phong3 {

    constructor(gl) {
        this.gl = gl;

        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,"ia");

        this.u_constante_ambiente = this.gl.getUniformLocation(this.shader_program,"ka");
        this.u_constante_difusa = this.gl.getUniformLocation(this.shader_program,"kd");
        this.u_constante_especular = this.gl.getUniformLocation(this.shader_program,"ks");
        this.u_brillo = this.gl.getUniformLocation(this.shader_program,"n");

        this.u_pspot = this.gl.getUniformLocation(this.shader_program,'pspot');
        this.u_ispot = this.gl.getUniformLocation(this.shader_program,'ispot');
        this.u_faspot = this.gl.getUniformLocation(this.shader_program,'faspot');
        this.u_dspot = this.gl.getUniformLocation(this.shader_program,'dspot');
        this.u_angulo = this.gl.getUniformLocation(this.shader_program,'angulo');

        this.u_ppuntual = this.gl.getUniformLocation(this.shader_program,'ppuntual');
        this.u_ipuntual = this.gl.getUniformLocation(this.shader_program,'ipuntual');
        this.u_fapuntual = this.gl.getUniformLocation(this.shader_program,"fapuntual");

        this.u_idireccional = this.gl.getUniformLocation(this.shader_program,'idireccional');
        this.u_ddireccional = this.gl.getUniformLocation(this.shader_program,'ddireccional');
    }

    set_luz(ambiente, spot, puntual, direccional) {
        this.gl.uniform3f(this.u_intensidad_ambiente , ambiente[0], ambiente[1], ambiente[2]);

        // luz spot
        let posicion = spot.posicion;
        let intensidad = spot.intensidad;
        let atenuacion = spot.atenuacion;
        let direccion = spot.direccion;

        let angulo = spot.angulo;

        if ( angulo < -180 || angulo > 180 ) angulo = 180;
        angulo = Math.cos(Math.PI*angulo/180);

        this.gl.uniform3f(this.u_pspot, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ispot, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_faspot, atenuacion[0], atenuacion[1], atenuacion[2]);
        this.gl.uniform3f(this.u_dspot, direccion[0], direccion[1], direccion[2]);
        this.gl.uniform1f(this.u_angulo, angulo);

        // luz puntual
        posicion = puntual.posicion;
        intensidad = puntual.intensidad;
        atenuacion = puntual.atenuacion;

        this.gl.uniform3f(this.u_ppuntual, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ipuntual, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_fapuntual, atenuacion[0], atenuacion[1], atenuacion[2]);

        // luz direccional
        intensidad = direccional.intensidad;
        direccion = direccional.direccion;

        this.gl.uniform3f(this.u_idireccional, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_ddireccional, direccion[0], direccion[1], direccion[2]);
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

        uniform vec3 ppuntual;
        uniform vec3 pspot;

        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 normal;
        out vec3 Lpuntual;
        out vec3 ojo;
        out vec3 Lspot;
        out vec3 LEspot;

        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(ppuntual,1));
            Lpuntual = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto




            LEspot = vec3(viewMatrix * vec4(pspot,1));
            Lspot = normalize( pspot - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot = normalize(vec3(LEspot-vPE));
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment() {
        return `#version 300 es
        precision mediump float;

        uniform vec3 ia;

        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float n;

        uniform vec3 ipuntual;
        uniform vec3 fapuntual;

        uniform vec3 dspot;
        uniform vec3 ispot;
        uniform float angulo;
        uniform vec3 faspot;

        uniform vec3 ddireccional;
        uniform vec3 idireccional;

        in vec3 Lspot;
        in vec3 LEspot;
        in vec3 normal;
        in vec3 Lpuntual;
        in vec3 ojo;

        out vec4 fragmentColor;

        void main() {
            float FP = 1.0/3.0;
            vec3 N = normalize(normal);
            vec3 L = normalize(Lpuntual);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);
            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
            float fa = 1.0/(1.0+fapuntual.x+fapuntual.y*d+fapuntual.z*d*d);
            vec3 luzpuntual = fa*ipuntual*(kd*NL + ks*NHn);


            vec3 Ldir = normalize(-ddireccional);
            NL = max(dot(N,Ldir),0.0);
            H = normalize(Ldir+V);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzdireccional =  idireccional*( kd*NL + ks*NHn );


            vec3 Dspot = normalize(-dspot);
            vec3 vL = normalize(Lspot);
            L = normalize(LEspot);
            H = normalize(L+V);
            NL = max(dot(N,L),0.0);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzspot = vec3(0,0,0);
            if ( angulo == 0.0 || dot(vL,Dspot) > angulo ) {
                d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
                fa = 1.0/(1.0+faspot.x+faspot.y*d+faspot.z*d*d);
                luzspot += fa*ispot*(kd*NL+ks*NHn);
            }

            vec3 color =  ia*ka + FP*(luzpuntual + luzspot + luzdireccional) ;

            fragmentColor = vec4( color ,1);

        }
        `;
    }

}
