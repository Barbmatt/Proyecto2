class Ligth{
    constructor(posicion, direccion, angulo){
        this.posL = posicion;
        this.dirL = direccion;
        this.intensidad_ambiente = [1.0,1.0,1.0];
        this.intensidad_difusa = [1.0,1.0,1.0];
        this.intensidad_especular = [1.0,1.0,1.0];
        this.angulo = angulo;
        this.atenuacion = 1.0;
    }

    set_posL(posL) { this.posL = posL; }

    set_intensidad_ambiente(intensidad_ambiente) { this.intensidad_ambiente = intensidad_ambiente; }

    set_intensidad_difusa(intensidad_difusa) { this.intensidad_difusa = intensidad_difusa; }

    set_intensidad_especular(intensidad_especular) { this.intensidad_especular = intensidad_especular; }

    set_angulo(angulo) { this.angulo = angulo; }

    set_atenuacion(a,b,c,d) { this.atenuacion = 1/(a+b*d+c*Math.pow(d,2)); }
}

