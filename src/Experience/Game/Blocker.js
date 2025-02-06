import * as THREE from 'three'
import Experience from '../Experience.js'
import AtlasMaterial from './Materials/AtlasMaterial.js'

export default class Blocker {
    constructor(position, angle, index, parentId) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.type = "Blocker"

        this.gameObject = this.createBlocker()
        this.gameObject.position.copy(position)
        this.gameObject.rotation.z = angle + Math.PI / 2

        // Create collider
        this.collider = this.createCollider(0.65, false)
        this.collider.name = `blocker-${parentId}-${index}`
        this.collider.userData.GO = this
        this.gameObject.add(this.collider)

        this.getType = () => this.type
        this.update = () => 
        this.getWorldPos = () => {
            const position = new THREE.Vector3()
            this.gameObject.getWorldPosition(position)
            return position
        }

        // Debug
        if(this.debug.active){
            this.debug.addLabel(this.collider.name, this)
        }
    }

    createBlocker() {
        const blockerModel = this.resources.items.blockerModel.scene.clone()
        blockerModel.children[0].material = new AtlasMaterial().getMaterial()
        return blockerModel
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.BoxGeometry(size, size, size)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }
}