// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var phong_v = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 L;// en coordenadas del mundo

in vec3 vertexNormal;
in vec3 vertexPosition;
out vec3 vNE;
out vec3 vLE;
out vec3 vVE;


void main() {
    vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
    vec3 LE = vec3(viewMatrix * vec4(L,1));
    vLE = normalize(vec3(LE-vPE));
    vNE = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
    vVE = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}
`

var goureaud_v = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 L;

uniform vec3 ia;
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
    vec3 LE = vec3(viewMatrix * vec4(L,1));
    vec3 L =normalize(LE-vertexPositionE);
    vec3 N =normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
    
    float id = max(dot(N,L),0.0); 
    
    vec3 V = normalize(-vertexPositionE); 
    vec3 R = normalize(reflect(-L,N));
    float is=pow(max(dot(R,V),0.0),n);
    
    color = ia*ka + fa*(kd*id + ks*is);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}
`

var ward_v = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 L;

in vec3 vertexNormal;
in vec3 vertexPosition;
out vec3 vi;
out vec3 vn;
out vec3 vr;

void main() {
    vec3 p = vec3(viewMatrix * modelMatrix *vec4(vertexPosition, 1));
    vi = vec3(viewMatrix * vec4(L,1)); 
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