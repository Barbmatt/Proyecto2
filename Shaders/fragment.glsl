// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var phong_f = `#version 300 es
precision mediump float;

uniform vec3 ia;
uniform float fa;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float n;

in vec3 normal;
in vec3 luz;
in vec3 ojo;

out vec4 fragmentColor;

void main() {
    vec3 N = normalize(normal);
    vec3 L = normalize(luz);
    vec3 V = normalize(ojo);
    vec3 H = normalize(L+V);
    
    float NL = max(dot(N,L),0.0); // intensidad de luz difusa 
    float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
    
    fragmentColor = vec4(ia*ka +fa*(kd*NL + ks*NHn),1);
       
}
`

var goureaud_f = `#version 300 es
precision mediump float;
in vec3 color;
out vec4 fragmentColor;

void main() {
    fragmentColor = vec4(color,1);
}
`

var ward_f = `#version 300 es
precision mediump float;

uniform vec3 ia;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float n;

in vec3 vi;
in vec3 vn;
in vec3 vr;
out vec4 fragmentColor;

void main() {
    vec3 vni = normalize(vi);
    vec3 vnn = normalize(vn);
    vec3 vnr = normalize(vr);
    vec3 vnh = normalize(vr+vi);
    
    float cos_ti = dot(vnn,vni);
    float cos_tr = dot(vnn,vnr);
    
    float tita_h = acos(dot(vnh,vnn));
    
    vec3 color = ia*ka;
    
    if ( cos_ti > 0.0 && cos_tr > 0.0 ) {
        float PI = 3.14159;
        float tangente = tan(tita_h);
        float n2 = n*n;
        float divisor = 4.0*PI*n2;
        float exp_aux = exp(-tangente*tangente/n2)/divisor;
        color += kd/PI + exp_aux * ks/sqrt(cos_ti*cos_tr);
    }
    else {
        color += kd*cos_ti + ks*cos_tr;
    }
    fragmentColor = vec4(color,1);
}
`

var color_posicion_f = `#version 300 es
    precision mediump float;

    in vec3 color;
    out vec4 fragmentColor;

    void main(){
        fragmentColor = vec4(color,1);
}
`