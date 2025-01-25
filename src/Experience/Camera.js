import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.distance = 24
        this.controls = null

        this.setInstance()
        this.setControls()

        // Mouse move, camera effect
        this.mousePosX = 0
        this.mousePosY = 0
        this.maxRotation = THREE.MathUtils.degToRad(1)
        this.targetPosition = new THREE.Vector3()

        window.addEventListener('mousemove', (event) => {
            this.mousePosX = (event.clientX / window.innerWidth) - 0.5
            this.mousePosY = (event.clientY / window.innerWidth) - 0.5
        })
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
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    recalculate() {
        const angleX = this.mousePosX * this.maxRotation
        const angleY = this.mousePosY * this.maxRotation

        const x = this.distance * Math.sin(angleX) * Math.cos(angleY)
        const y = this.distance * Math.sin(angleY)
        const z = this.distance * Math.cos(angleX) * Math.cos(angleY)

        this.targetPosition.set(x, y, z)
    }

    update() {
        if (this.controls) this.controls.update()

        /* this.recalculate()
        this.instance.position.lerp(this.targetPosition, 0.1) */
    }
}