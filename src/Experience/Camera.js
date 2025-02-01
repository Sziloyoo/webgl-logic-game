import * as THREE from 'three'
import Experience from './Experience.js'
import CameraControls from 'camera-controls'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug
        this.defaultPosition = new THREE.Vector3(0, 0, 24)
        this.farPosition = new THREE.Vector3(0, 0, 52) // This used when a portrait oriented screen needs more width space
        this.controls = null

        this.setInstance()
        this.setControls()

        // Mouse movement camera rotation
        this.mouseX = 0
        this.mouseY = 0
        this.azimuthAngle = 0
        this.polarAngle = Math.PI / 2
        this.moveAmount = 0.125

        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1
            this.mouseY = (event.clientY / window.innerHeight) * 2 - 1

            this.azimuthAngle = 0 + this.mouseX * this.moveAmount
            this.polarAngle = Math.PI / 2 + this.mouseY * this.moveAmount
        })

        // Debug settings
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder({
                title: 'Camera',
            })
            this.debugFolder.addBinding(this.controls, 'enabled', { label: 'Debug Camera' })
            this.debugFolder.addBinding(this, 'moveAmount', { label: 'Move Amount', min: 0, max: 1.0 })
        }

        this.updateCameraPosition()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.updateCameraPosition()
        this.scene.add(this.instance)
    }

    setControls() {
        CameraControls.install({ THREE: THREE })
        this.controls = new CameraControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI
        this.controls.enabled = false
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
        if (!this.controls.enabled) this.updateCameraPosition()
    }

    update(delta) {
        this.controls?.update(delta)
        if (!this.controls.enabled) {
            this.controls.rotateAzimuthTo(this.azimuthAngle, true)
            this.controls.rotatePolarTo(this.polarAngle, true)
        }
    }

    updateCameraPosition() {
        let aspectRatio = window.innerWidth / window.innerHeight
        const t = THREE.MathUtils.clamp((aspectRatio - 9 / 16) / ((16 / 9) - (9 / 16)), 0, 1)

        // Lerp between closePosition and farPosition
        const newPosition = new THREE.Vector3().lerpVectors(this.farPosition, this.defaultPosition, t)
        this.controls?.setPosition(newPosition.x, newPosition.y, newPosition.z, true)
    }
}