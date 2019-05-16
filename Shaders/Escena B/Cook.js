class Cook{

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');

        this.u_iambiente = this.gl.getUniformLocation(this.shader_program,"ia");

        this.u_constante_ambiente = this.gl.getUniformLocation(this.shader_program,"ka");
        this.u_constante_difusa = this.gl.getUniformLocation(this.shader_program,"kd");
        this.u_constante_especular = this.gl.getUniformLocation(this.shader_program,"ks");
        this.u_alfa = this.gl.getUniformLocation(this.shader_program,"alfa");
        this.u_f0 = this.gl.getUniformLocation(this.shader_program,"f0");

        this.u_ppuntual = this.gl.getUniformLocation(this.shader_program,'posicion_luz');
        this.u_ipuntual = this.gl.getUniformLocation(this.shader_program,'intensidad');
        this.u_fapuntual = this.gl.getUniformLocation(this.shader_program,'atenuacion');
    }

    set_luz(puntual,ambiente) {
        this.gl.uniform3f(this.u_iambiente , ambiente[0], ambiente[1], ambiente[2]);

        // luz puntual
        let posicion = puntual.posicion;
        let intensidad = puntual.intensidad;
        let atenuacion = puntual.atenuacion;

        this.gl.uniform3f(this.u_posicion_luz, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_intensidad, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_atenuacion, atenuacion[0], atenuacion[1], atenuacion[2]);
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


vertex(){
	return `#version 300 es 

		uniform mat4 viewMatrix;
		uniform mat4 projectionMatrix;
		uniform mat4 modelMatrix;
		uniform mat4 normalMatrix;

		uniform vec3 posicion_luz;

		in vec3 vertexNormal;
		in vec3 vertexPosition;

		out vec3 luz;
		out vec3 ojo;
		out vec3 normal;


		void main() {
		    vec3 pos = vec3( viewMatrix * modelMatrix * vec4(vertexPosition, 1) );
		    luz = vec3( viewMatrix * vec4(posicion_luz, 1) );
		    luz = normalize( luz - pos );
		    ojo = normalize( -pos );
		    normal = normalize( vec3( normalMatrix * vec4(vertexNormal, 1) ) );
		    
		    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1); 
}`;
}

fragment(){
	return `#version 300 es
precision mediump float;

uniform vec3 ia;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float alfa;
uniform float f0;
uniform vec3 intensidad;
uniform vec3 atenuacion;

in vec3 luz;
in vec3 ojo;
in vec3 normal;

out vec4 fragmentColor;

void main() {
    float PI = 3.14159;
    
    vec3 L = normalize(luz);
    vec3 V = normalize(ojo);
    vec3 N = normalize(normal);
    vec3 H = normalize(V+L);
    
    float NH = max( dot(N,H) , 0.0001);
    float NV = max( dot(N,V) , 0.0001);
    float VH = max( dot(V,H) , 0.0001);
    float NL = max( dot(N,L) , 0.0001);
    
    float G = min(1.0, min(2.0*NH*NV/VH, 2.0*NH*NL/VH));
    
	float Ft = f0 + (1.0-f0) * pow(1.0-VH,5.0);
    float tan2b = ( 1.0 - (NH*NH) ) / ( NH*NH );
    float exponente = -tan2b/(alfa*alfa);
    float divisor = alfa * alfa * pow(NH,4.0); 			
    float Dt = exp(exponente)/divisor;
    
    float d = sqrt( L.x*L.x + L.y*L.y + L.z*L.z );
    float fatt = 1.0/( 1.0 + atenuacion.x + atenuacion.y*d + atenuacion.z*d*d );
    
    float CT = (Ft/PI)*( (Dt*G) / (NV*NL) );
    vec3 especular = ks*fatt*intensidad*CT;
    
    vec3 difuso = intensidad*kd*fatt*NL;  
    
    vec3 color = ia*ka + difuso + especular;
    
    
    fragmentColor = vec4(color,1);
}`;
}
}