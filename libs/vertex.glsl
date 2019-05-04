// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var vertexShaderSource = `#version 300 es

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;

uniform vec3 posL;// en coordenadas del mundo

in vec3 vertexNormal;
in vec3 vertexPosition;
out vec3 vNE;
out vec3 vLE;
out vec3 vVE;


void main() {
    vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
    vec3 posLE = vec3(viewMatrix * vec4(posL,1));
    vLE = normalize(vec3(posLE-vPE));
    vNE = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
    vVE = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
}
`