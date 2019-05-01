class Ligth{
    constructor(){
    this.posL[3] = [10.0,10.0,10.0];
    this.angulo;
    this.intensidad_ambiente[3] = [1.0,1.0,1.0];
    this.intensidad_difusa[3] = [1.0,1.0,1.0];
    this.atenuacion;
    }

    func_atenuacion(a,b,c,d){
    this.atenuacion = 1/(a+b*d+c*pow(d,2));
    return this.atenuacion;
    }
}

