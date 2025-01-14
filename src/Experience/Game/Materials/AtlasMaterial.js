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
            metalnessMap: this.aormMap
        })
    }

    getMaterial() {
        return this.material;
    }
}