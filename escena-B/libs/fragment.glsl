// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;
out vec4 fragColor;
void main(void) {
	fragColor = vec4(vColor, 1.0);
}
`