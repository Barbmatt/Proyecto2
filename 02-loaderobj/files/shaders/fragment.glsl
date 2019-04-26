// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource = `#version 300 es
precision mediump float;

uniform vec3 intensidad_ambiente;
uniform vec3 intensidad_difusa;
uniform float func_atenuacion;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float n;

in vec3 vNE;
in vec3 vLE;
in vec3 vVE;

vec3 color;
out vec3 fragmentColor;

void main() {
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    
    float luz_difusa = max(dot(N,L),0.0); // intensidad de luz difusa 
    float luz_especular=pow(max(dot(N,H),0.0),n);// intensidad de luz especular
   
    vec3 luz1 = (0.3) * func_atenuacion*intensidad_difusa*(kd*luz_difusa + ks*luz_especular);
	vec3 luz2 = (1.0) * func_atenuacion*intensidad_difusa*(kd*luz_difusa + ks*luz_especular);
    vec3 luz3 = (0.7) * func_atenuacion*intensidad_difusa*(kd*luz_difusa + ks*luz_especular);
    color = intensidad_ambiente*ka + luz1 + luz2 + luz3 ; 
    fragmentColor = color;
}
`