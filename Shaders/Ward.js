class Ward {

    constructor(vertexShaderSource, fragmentShaderSource) {
        this.shader_program = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

        this.u_matriz_vista = gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion_luz = gl.getUniformLocation(this.shader_program,'posL');

        this.loc_posicion = gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_normal = gl.getAttribLocation(this.shader_program, 'vertexNormal');

        this.u_ps = gl.getUniformLocation(this.shader_program,'pd');
        this.u_pd = gl.getUniformLocation(this.shader_program,'ps');
        this.u_alfa = gl.getUniformLocation(this.shader_program,'alfa');
    }
    
    set_luz(luz) {
        let pos_luz = luz.posL;
        gl.uniform3f(this.u_posicion_luz, pos_luz[0], pos_luz[1], pos_luz[2]);
    }

    set_material(material) {
        let pd = material.pd;
        let ps = material.ps;
        let alfa = material.alfa;
        gl.uniform3f(this.u_pd,pd[0],pd[1],pd[2]);
        gl.uniform3f(this.u_ps,ps[0],ps[1],ps[2]);
        gl.uniform1f(this.u_alfa,alfa);
    }
}