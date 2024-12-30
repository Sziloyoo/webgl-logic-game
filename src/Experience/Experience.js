import * as THREE from 'three'
import Controls from "./Controls"
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './Game/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'

let instance = null

export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Game states
        this.gameState = {
            numberOfRings: 3,
            selectedRing: 3,
            socketIndexes: [2, 6, 9, 11]
        }

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World(this.gameState)

        // Control events
        this.controls = new Controls()
        this.controls.on('up', this.upEvent)
        this.controls.on('down', this.downEvent)
        this.controls.on('left', this.leftEvent)
        this.controls.on('right', this.rightEvent)

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    // Control functions
    upEvent = () => {
        if(this.gameState.selectedRing >= this.gameState.numberOfRings) return
        this.gameState.selectedRing++
        this.world.setRingActive(this.gameState.selectedRing)
    }
    downEvent = () => {
        if(this.gameState.selectedRing <= 1) return
        this.gameState.selectedRing--
        this.world.setRingActive(this.gameState.selectedRing)
    }
    leftEvent = () => {
        this.world.rotateRing(this.gameState.selectedRing, true)
    }
    rightEvent = () => {
        this.world.rotateRing(this.gameState.selectedRing, false)
    }

    // Application events
    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }
}