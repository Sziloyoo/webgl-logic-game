import * as THREE from 'three'
import Experience from '../../Experience'

let instance = null

export default class AtlasMaterial{
    constructor(){
        if (instance) {
            return instance
        }
        instance = this

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.colorMap = this.resources.items.atlasColor
        this.colorMap.colorSpace = THREE.SRGBColorSpace
        this.colorMap.flipY = false

        this.normalMap = this.resources.items.atlasNormal
        this.normalMap.flipY = false

        this.aormMap = this.resources.items.atlasAORM
        this.aormMap.flipY = false

        this.envMap = this.resources.items.envMap
        this.envMap.mapping = THREE.EquirectangularReflectionMapping

        this.material = new THREE.MeshStandardMaterial({
            map: this.colorMap,
            normalMap: this.normalMap,
            aoMap: this.aormMap,
            roughnessMap: this.aormMap,
            metalnessMap: this.aormMap,
            metalness: 0.6,
            roughness: 0.5,
            normalScale: new THREE.Vector2(1.0, 1.0),
            aoMapIntensity: 1.5
        })

        if(this.debug.active) this.createDebugFolder()
    }

    getMaterial() {
        return this.material;
    }

    createDebugFolder(){
        this.debugFolder = this.debug.ui.addFolder({
            title: 'Atlas Material',
        })
        this.debugFolder.addBinding(this.material, 'metalness', { label: 'Metalness', min: 0, max: 1 })
        this.debugFolder.addBinding(this.material, 'roughness', { label: 'Roughness', min: 0, max: 1 })
        this.debugFolder.addBinding(this.material, 'normalScale', { label: 'Normal Strength', min: 1, max: 3 })
        this.debugFolder.addBinding(this.material, 'aoMapIntensity', { label: 'AO Intensity', min: 0, max: 2 })
    }
}