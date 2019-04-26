class Camara_mouse {

    constructor(camera, registerZone) {
        this.dragFactor    = 0.07  // sensibilidad del drag
        this.zoomFactor    = 0.01   // sensibilidad del zoom
        this.dragging      = false
        this.lastX         = 0
        this.lastY         = 0
        this.camera        = camera
        this.registerZone  = registerZone

        this.registerZone.addEventListener("wheel", (event) => { this.zoom(event) }, { passive: true })
        this.registerZone.addEventListener("mousedown", (event) => { this.dragStart(event) })
        this.registerZone.addEventListener("dblclick", (event) => { camera.reset() })
        document.addEventListener("mousemove", (event) => { this.dragMove(event) })
        document.addEventListener("mouseup", () => { this.dragEnd() })
    }

    zoom(event) {
        this.camera.zoom(event.deltaY * this.zoomFactor * 4)
        onRender()
    }

    dragStart(event) {
        event.preventDefault()
        const leftClick = 1

        if (event.which === leftClick) {
            this.dragging = true
            this.lastX    = event.clientX
            this.lastY    = event.clientY
        }
        onRender()
    }

    dragMove(event) {
        if (this.dragging) {
            const mouseChangeX = (event.clientX - this.lastX)
            const mouseChangeY = (event.clientY - this.lastY)

            this.camera.paneo(mouseChangeX * this.dragFactor)
            this.camera.altura(mouseChangeY * this.dragFactor)

            this.lastX = event.clientX
            this.lastY = event.clientY
        }
        onRender()
    }

    dragEnd() {
        this.dragging = false
        onRender()
    }
}
