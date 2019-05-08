class Phong {

    constructor(vertexShaderSource, fragmentShaderSource) {
        this.shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
        
        this.u_matriz_vista = gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion_luz = gl.getUniformLocation(this.shader_program,'L');

        this.loc_normal = gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = gl.getAttribLocation(this.shader_program, 'vertexPosition');

        this.u_intensidad_ambiente = gl.getUniformLocation(this.shader_program,"ia");
        this.u_intensidad_difusa = gl.getUniformLocation(this.shader_program,"id");
        this.u_intensidad_especular = gl.getUniformLocation(this.shader_program,"is");

        this.u_atenuacion = gl.getUniformLocation(this.shader_program,"fa");
        
        this.u_constante_ambiente = gl.getUniformLocation(this.shader_program,"ka");
        this.u_constante_difusa = gl.getUniformLocation(this.shader_program,"kd");
        this.u_constante_especular = gl.getUniformLocation(this.shader_program,"ks");
        this.u_brillo = gl.getUniformLocation(this.shader_program,"n");    
    }

    set_luz(luz) {
        let pos_l = luz.posL;
        gl.uniform3f(this.u_posicion_luz, pos_l[0], pos_l[1], pos_l[2]);
        gl.uniform1f(this.u_atenuacion, luz.atenuacion);
    }

    set_material(material) {
        let ka = material.ka;
        let ks = material.ks;
        let kd = material.kd;
        let n = material.n;
        gl.uniform3f(this.u_constante_ambiente,ka[0],ka[1],ka[2]);
        gl.uniform3f(this.u_constante_difusa,kd[0],kd[1],kd[2]);
        gl.uniform3f(this.u_constante_especular,ks[0],ks[1],ks[2]);
        gl.uniform1f(this.u_brillo,n);
    }
}