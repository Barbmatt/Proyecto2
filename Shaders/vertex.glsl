// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var phong_v = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 posL;// en coordenadas del mundo

in vec3 vertexNormal;
in vec3 vertexPosition;
out vec3 normal;
out vec3 luz;
out vec3 ojo;


void main() {
    vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
    vec3 LE = vec3(viewMatrix * vec4(posL,1));
    luz = normalize(vec3(LE-vPE));
    normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
    ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}
`

var goureaud_v = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 posL;

uniform vec3 ia;
uniform vec3 is;
uniform vec3 id;
uniform float fa;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float n;

in vec3 vertexNormal;
in vec3 vertexPosition;
out vec3 color;

void main() {
    vec3 vertexPositionE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
    vec3 LE = vec3(viewMatrix * vec4(posL,1));
    vec3 L =normalize(LE-vertexPositionE);
    vec3 N =normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
    
    vec3 V = normalize(-vertexPositionE); 
    vec3 H = normalize(L+V);
    float NL = max(dot(N,L),0.0);
    float NHn = pow(max(dot(N,H),0.0),n);

    
    color = ia*ka + fa*(kd*id*NL + ks*is*NHn);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}
`

var ward_v = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 posL;

in vec3 vertexNormal;
in vec3 vertexPosition;
out vec3 vi;
out vec3 vn;
out vec3 vr;

void main() {
    vec3 p = vec3(viewMatrix * modelMatrix *vec4(vertexPosition, 1));
    vi = vec3(viewMatrix * vec4(posL,1)); 
    vi = vi - p;
    vr = -p;
    vn = vec3(normalMatrix*vec4(vertexNormal,1));
    vi = normalize(vi);
    vn = normalize(vn);
    vr = normalize(vr);
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}
`

var color_posicion_v = `#version 300 es

    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 projectionMatrix;

    in vec3 vertexPosition;
    out vec3 color;

    void main() {
        color = vertexPosition;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}

`