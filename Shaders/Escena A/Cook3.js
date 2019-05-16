class Cook3 {

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');

        this.u_iambiente = this.gl.getUniformLocation(this.shader_program,"iambiente");

        this.u_constante_ambiente = this.gl.getUniformLocation(this.shader_program,"ka");
        this.u_constante_difusa = this.gl.getUniformLocation(this.shader_program,"kd");
        this.u_constante_especular = this.gl.getUniformLocation(this.shader_program,"ks");
        this.u_alfa = this.gl.getUniformLocation(this.shader_program,"alfa");
        this.u_f0 = this.gl.getUniformLocation(this.shader_program,"f0");

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
        this.gl.uniform3f(this.u_iambiente , ambiente[0], ambiente[1], ambiente[2]);

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
        let alfa = material.alfa;
        let f0 = material.f0;
        this.gl.uniform3f(this.u_constante_ambiente,ka[0],ka[1],ka[2]);
        this.gl.uniform3f(this.u_constante_difusa,kd[0],kd[1],kd[2]);
        this.gl.uniform3f(this.u_constante_especular,ks[0],ks[1],ks[2]);
        this.gl.uniform1f(this.u_alfa,alfa);
        this.gl.uniform1f(this.u_f0,f0);
    }

    vertex() {
        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 normalMatrix;

        uniform vec3 ppuntual;
        uniform vec3 pspot;
        uniform vec3 ddireccional;

        in vec3 vertexNormal;
        in vec3 vertexPosition;

        out vec3 ddireccion;
        out vec3 lpuntual;
        out vec3 lspot;
        out vec3 lEspot;
        out vec3 ojo;
        out vec3 normal;

        void main() {
            vec3 pos = vec3( viewMatrix * modelMatrix * vec4(vertexPosition, 1) );
            ojo = normalize( -pos );
            normal = normalize( vec3( normalMatrix * vec4(vertexNormal, 1) ) );

            lpuntual = vec3( viewMatrix * vec4(ppuntual, 1) );
            lpuntual = normalize( lpuntual - pos );

            lspot = normalize( pspot - vec3(modelMatrix *vec4(vertexPosition, 1)));

            lEspot = vec3( viewMatrix * vec4(pspot, 1) );
            lEspot = normalize( lEspot - pos );

            ddireccion = vec3( viewMatrix *vec4(ddireccional,0) );

            gl_Position = projectionMatrix *viewMatrix * modelMatrix*vec4(vertexPosition,1);
        }`;
    }



    fragment() {
        return `#version 300 es
        precision mediump float;

        uniform vec3 iambiente;
        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float alfa;
        uniform float f0;

        uniform vec3 ipuntual;
        uniform vec3 fapuntual;

        uniform vec3 ispot;
        uniform vec3 faspot;
        uniform vec3 dspot;
        uniform float angulo;

        uniform vec3 idireccional;

        in vec3 ddireccion;
        in vec3 lpuntual;
        in vec3 lspot;
        in vec3 lEspot;
        in vec3 ojo;
        in vec3 normal;

        out vec4 fragmentColor;

        float PI = 3.14159;
        vec3 V;
        vec3 N;
        float NV;

        vec3 cook_puntual() {
            vec3 L = normalize(lpuntual);
            vec3 H = normalize(V+L);

            float NH = max( dot(N,H) , 0.0001);
            float VH = max( dot(V,H) , 0.0001);
            float NL = max( dot(N,L) , 0.0001);

            float G = min(1.0, min(2.0*NH*NV/VH, 2.0*NH*NL/VH));

            float Ft = f0 + (1.0-f0) * pow(1.0-VH,5.0);
            float tan2b = ( 1.0 - (NH*NH) ) / ( NH*NH );
            float exponente = -tan2b/(alfa*alfa);
            float divisor = alfa * alfa * pow(NH,4.0);

            float Dt = exp(exponente)/divisor;

            float d = sqrt( L.x*L.x + L.y*L.y + L.z*L.z );
            float fatt = 1.0/( 1.0 + fapuntual.x + fapuntual.y*d + fapuntual.z*d*d );

            float CT = (Ft/PI)*( (Dt*G) / (NV*NL) );
            vec3 especular = ks*fatt*ipuntual*CT;
            vec3 difuso = ipuntual*kd*fatt*NL;
            return difuso + especular;
        }

        vec3 cook_direccional() {
            vec3 L = normalize(-ddireccion);
            vec3 H = normalize(V+L);

            float NH = max( dot(N,H) , 0.0001);
            float VH = max( dot(V,H) , 0.0001);
            float NL = max( dot(N,L) , 0.0001);

            float G = min(1.0, min(2.0*NH*NV/VH, 2.0*NH*NL/VH));


            float Ft = f0 + (1.0-f0) * pow(1.0-VH,5.0);
            float tan2b = ( 1.0 - (NH*NH) ) / ( NH*NH );
            float exponente = -tan2b/(alfa*alfa);
            float divisor = alfa * alfa * pow(NH,4.0);



            float Dt = exp(exponente)/divisor;

            float CT = (Ft/PI)*( (Dt*G) / (NV*NL) );
            vec3 especular = ks*idireccional*CT;
            vec3 difuso = idireccional*kd*NL;
            return difuso + especular;
        }

        vec3 cook_spot() {
            vec3 D = normalize(-dspot);
            vec3 Lspot = normalize(lspot);
            vec3 color  = vec3(0,0,0);

            if ( angulo == 0.0 || dot(Lspot,D) > angulo ) {

                vec3 L = normalize(lEspot);
                vec3 H = normalize(V+L);

                float NH = max( dot(N,H) , 0.0001);
                float VH = max( dot(V,H) , 0.0001);
                float NL = max( dot(N,L) , 0.0001);

                float G = min(1.0, min(2.0*NH*NV/VH, 2.0*NH*NL/VH));

                float Ft = f0 + (1.0-f0) * pow(1.0-VH,5.0);
                float tan2b = ( 1.0 - (NH*NH) ) / ( NH*NH );
                float exponente = -tan2b/(alfa*alfa);
                float divisor = alfa * alfa * pow(NH,4.0);

                float Dt = exp(exponente)/divisor;

                float d = sqrt( L.x*L.x + L.y*L.y + L.z*L.z );
                float fatt = 1.0/( 1.0 + faspot.x + faspot.y*d + faspot.z*d*d );

                float CT = (Ft/PI)*( (Dt*G) / (NV*NL) );
                vec3 especular = ks*fatt*ispot*CT;
                vec3 difuso = ispot*kd*fatt*NL;
                color = difuso + especular;
            }
            return color;
        }



        void main() {
            V = normalize(ojo);

            N = normalize(normal);

            NV = max( dot(N,V) , 0.0001);
            float FP = 1.0/3.0;
            vec3 luzpuntual = cook_puntual();
            vec3 luzspot = cook_spot();
            vec3 luzdireccional = cook_direccional();

            vec3 luz = iambiente*ka + FP*( luzpuntual + luzspot + luzdireccional );

            fragmentColor = vec4(luz,1);
        }`;
    }
}
