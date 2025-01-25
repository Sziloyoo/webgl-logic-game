import Experience from '../Experience.js'
import * as THREE from 'three'

export default class Lighting {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug panel
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder({
                title: 'Lights',
            }) 
        }

        // Place lights into the scene
        this.initLights()
    }

    initLights() {
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
        directionalLight.position.set(1, 2, 5)
        this.scene.add(directionalLight)

        // Environment map
        const envMap = this.resources.items.envMap
        envMap.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = envMap

        // Setup debug parameters
        if (this.debug.active) {
            this.debugFolder.addBinding(directionalLight, 'intensity', { label: 'Directional Intensity', min: 0, max: 2 })
            this.debugFolder.addBinding(this.scene, 'environmentIntensity', { label: 'Environment Intensity', min: 0, max: 2 })
        }
    }
}