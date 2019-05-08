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

        this.u_pa = this.gl.getUniformLocation(this.shader_program,'pa');
        this.u_pd = this.gl.getUniformLocation(this.shader_program,'pd');
        this.u_ps = this.gl.getUniformLocation(this.shader_program,'ps');
        this.u_alfa = this.gl.getUniformLocation(this.shader_program,'alfa');
    }
    
    set_luz(luz) {
        let pos_luz = luz.posL;
        this.gl.uniform3f(this.u_posicion_luz, pos_luz[0], pos_luz[1], pos_luz[2]);
    }

    set_material(material) {
        let pa = material.pa;
        let pd = material.pd;
        let ps = material.ps;
        let alfa = material.alfa;
        this.gl.uniform3f(this.u_pa,pa[0],pa[1],pa[2]);
        this.gl.uniform3f(this.u_pd,pd[0],pd[1],pd[2]);
        this.gl.uniform3f(this.u_ps,ps[0],ps[1],ps[2]);
        this.gl.uniform1f(this.u_alfa,alfa);
    }
}