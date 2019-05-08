// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var phong_f = `#version 300 es
precision mediump float;

uniform vec3 ia;
uniform float fa;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float n;

in vec3 vNE;
in vec3 vLE;
in vec3 vVE;

out vec3 fragmentColor;

void main() {
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    
    float id = max(dot(N,L),0.0); // intensidad de luz difusa 
    float is = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
   
    fragmentColor = ia*ka + fa*(kd*id + ks*is);
}
`

var goureaud_f = `#version 300 es
precision mediump float;
in vec3 color;
out vec3 fragmentColor;

void main() {
    fragmentColor = color;
}
`

var ward_f = `#version 300 es
precision mediump float;

uniform vec3 pd;
uniform vec3 ps;
uniform float alfa;

in vec3 vi;
in vec3 vn;
in vec3 vr;
out vec3 fragmentColor;

void main() {
    vec3 vni = normalize(vi);
    vec3 vnn = normalize(vn);
    vec3 vnr = normalize(vr);
    vec3 vnh = normalize(vr+vi);
    
    float cos_ti = dot(vnn,vni);
    float cos_tr = dot(vnn,vnr);
    
    float tita_h = acos(dot(vnh,vnn));
    
    float PI = 3.14159;
    vec3 color = pd/PI; 
    
    if ( (cos_ti > 0.001) && (cos_tr > 0.001) ) {
        float a2 = alfa*alfa;
        float tangente = tan(tita_h/a2);
        float divisor = 4.0*PI*a2;
        float exp_aux = exp(-tangente*tangente)/divisor;
        color += exp_aux * ps/sqrt(cos_ti*cos_tr);
    }
    
    fragmentColor = color;
}
`

var color_posicion_f = `#version 300 es
    precision mediump float;

    in vec3 color;
    out vec3 fragmentColor;

    void main(){
        fragmentColor = color;
}
`