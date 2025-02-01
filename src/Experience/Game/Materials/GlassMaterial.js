import * as THREE from 'three'
import Experience from '../../Experience'

export default class GlassMaterial{
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.alphaMap = this.resources.items.glassOpacity
        this.alphaMap.flipY = false

        this.normalMap = this.resources.items.glassNormal
        this.normalMap.flipY = false

        this.aormMap = this.resources.items.glassAORM
        this.aormMap.flipY = false

        this.envMap = this.resources.items.envMap
        this.envMap.mapping = THREE.EquirectangularReflectionMapping

        this.material = new THREE.MeshPhysicalMaterial({
            transparent: true,
            transmissionMap: this.alphaMap,
            transmission: 1.0,
            opacity: 0.9,
            normalMap: this.normalMap,
            aoMap: this.aormMap,
            roughnessMap: this.aormMap,
            ior: 1.5,
            reflectivity: 0.5
        })

        if(this.debug.active) this.createDebugFolder()
    }

    getMaterial() {
        return this.material;
    }

    createDebugFolder(){
        this.debugFolder = this.debug.ui.addFolder({
            title: 'Glass Material',
        })
        this.debugFolder.addBinding(this.material, 'transmission', { label: 'Transmission', min: 0, max: 1 })
        this.debugFolder.addBinding(this.material, 'opacity', { label: 'Opacity', min: 0, max: 1 })
        this.debugFolder.addBinding(this.material, 'ior', { label: 'IOR', min: 1, max: 2.33 })
        this.debugFolder.addBinding(this.material, 'reflectivity', { label: 'Reflectivity', min: 0, max: 1.0 })
    }
}