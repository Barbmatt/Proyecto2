// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var vertexShaderSource = `#version 300 es

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

in vec3 vertexPos;
in vec3 vertexCol;

out vec3 vColor;

void main(void) {
	vColor = vertexCol;
	gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1.0);
}
`