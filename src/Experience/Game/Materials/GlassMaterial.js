import * as THREE from 'three'
import Experience from '../../Experience'

export default class GlassMaterial{
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.alphaMap = this.resources.items.glassOpacity
        this.alphaMap.flipY = false

        this.normalMap = this.resources.items.glassNormal
        this.normalMap.flipY = false

        this.aormMap = this.resources.items.glassAORM
        this.aormMap.flipY = false

        this.envMap = this.resources.items.envMap
        this.envMap.mapping = THREE.EquirectangularReflectionMapping

        this.material = new THREE.MeshStandardMaterial({
            transparent: true,
            alphaMap: this.alphaMap,
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