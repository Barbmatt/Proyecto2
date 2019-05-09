class Ward {

    constructor(vertexShaderSource, fragmentShaderSource, gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

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
}