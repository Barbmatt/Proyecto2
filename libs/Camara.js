// clase apuntada para la manipulación de la cámara, en cartesianas

class Camara {

    // construye la cámara con valores por defecto
    constructor(registerZone) {
        this.reset(); // para reutilizar código
        this.matriz_vista = mat4.create();

        this.fovy = 50*Math.PI/180; // fovy = 50°
        this.aspect = 1;
        this.zNear = 0.1;
        this.zFar = 450;
        this.matriz_proyeccion = mat4.create();

        // controles mouse.

        this.dragFactor    = 0.1  // sensibilidad del drag
        this.zoomFactor    = 0.01   // sensibilidad del zoom
        this.dragging      = false
        this.lastX         = 0
        this.lastY         = 0
        this.registerZone  = registerZone

        this.registerZone.addEventListener("wheel", (event) => { this.zoom_mouse(event) }, { passive: true })
        this.registerZone.addEventListener("mousedown", (event) => { this.drag_start(event) })
        this.registerZone.addEventListener("dblclick", (event) => { this.reset() })
        document.addEventListener("mousemove", (event) => { this.drag_move(event) })
        document.addEventListener("mouseup", () => { this.drag_end() })
    }

    // resetea la cámara
    reset() {
        this.r = 90;
        this.t = 60*Math.PI/180;
        this.f = 40*Math.PI/180;
    }

    // crea y retorna la matriz de proyección
    proyeccion() { 
        mat4.perspective(this.matriz_proyeccion, this.fovy, this.aspect, this.zNear, this.zFar);
        return this.matriz_proyeccion;
    }

    // crea y retorna la matriz de vista
    vista() {
        // crea un cuaternión con las rotaciones de f y r
        let cuaternion_rotacion = quat.create();
        quat.rotateX(cuaternion_rotacion, cuaternion_rotacion, this.f);
        quat.rotateY(cuaternion_rotacion, cuaternion_rotacion, this.t);

        // conversión cuaternión-matriz
        let matriz_rotation = mat4.create();
        mat4.fromQuat(matriz_rotation,cuaternion_rotacion);

        // traslación en función de r
        let matriz_traslacion = mat4.create();
        mat4.fromTranslation(matriz_traslacion, [0,0,-this.r]);

        // se aplican los cambios a la matriz de vista y se la retorna
        mat4.multiply(this.matriz_vista,matriz_traslacion,matriz_rotation);
        return this.matriz_vista;
    }

    // efectúa el paneo en función de un nuevo valor de t en grados
    paneo(nuevo_t) { this.t += nuevo_t*Math.PI/180; }
        
    // efectúa el zoom en función de un nuevo valor de r
    zoom(nuevo_r) { this.r += nuevo_r; }

    // efectúa el cambio de altura en función de un nuevo valor de f en grados
    altura(nuevo_f) { this.f += nuevo_f*Math.PI/180; }

    // rota la cámara alrededor del eje Y, en función del ángulo en grados que viene como parámetro
    rotar_camara(delta_t) { this.t += delta_t*Math.PI/180; }
    
    zoom_mouse(event) { this.zoom(event.deltaY * this.zoomFactor * 7) }

    drag_start(event) {
        event.preventDefault()
        const leftClick = 1

        if (event.which === leftClick) {
            this.dragging = true
            this.lastX    = event.clientX
            this.lastY    = event.clientY
        }
    }

    flecha_arriba() { this.altura(2); }

    flecha_abajo() { this.altura(-2); }

    flecha_izquierda() { this.paneo(-2); }

    flecha_derecha() { this.paneo(2); }

    drag_move(event) {
        if (this.dragging) {
            const mouseChangeX = (event.clientX - this.lastX)
            const mouseChangeY = (event.clientY - this.lastY)

            this.paneo(mouseChangeX * this.dragFactor)
            this.altura(mouseChangeY * this.dragFactor)

            this.lastX = event.clientX
            this.lastY = event.clientY
        }
    }

    drag_end() { this.dragging = false }
}