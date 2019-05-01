class Ligth{
    constructor(){
    this.posL = [10.0,10.0,10.0];
    this.angulo;
    this.intensidad_ambiente = [1.0,1.0,1.0];
    this.intensidad_difusa = [1.0,1.0,1.0];
    this.atenuacion;
    }

    func_atenuacion(a,b,c,d){
    this.atenuacion = 1/(a+b*d+c*Math.pow(d,2));
    return this.atenuacion;
    }
}

