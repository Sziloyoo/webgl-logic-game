import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug
        this.distance = 24
        this.controls = null

        this.setInstance()
        this.setControls()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder({
                title: 'Camera',
            })
            this.debugFolder.addBinding(this.controls, 'enabled', { label: 'Debug Camera' })
            this.debugFolder.addButton({ title: "Reset Camera" }).on('click', () => { this.resetCamera() })
        }
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, this.distance)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI
        this.controls.enabled = false
    }

    resetCamera() {
        this.instance.position.set(0, 0, this.distance)
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if (this.controls) this.controls.update()
    }
}