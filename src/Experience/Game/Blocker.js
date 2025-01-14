import * as THREE from 'three'
import Experience from '../Experience.js'
import AtlasMaterial from './Materials/AtlasMaterial.js'

export default class Blocker {
    constructor(position, angle, index) {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.gameObject = this.createBlocker()
        this.gameObject.position.copy(position)
        this.gameObject.rotation.z = angle + Math.PI / 2

        // Create collider
        this.collider = this.createCollider(0.1, false)
        this.collider.name = `blocker-${index}`
        this.collider.userData.GO = this
        this.gameObject.add(this.collider)

        this.update = () => {
            //dthis.gameObject.lookAt(0, 0, 0)
        }

        this.getType = () => this.constructor.name
    }

    createBlocker() {
        const blockerModel = this.resources.items.blockerModel.scene.clone()

        blockerModel.scale.x = 3
        blockerModel.scale.z = 3
        blockerModel.scale.y = 3

        blockerModel.children[0].material = new AtlasMaterial().getMaterial()
        return blockerModel
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.SphereGeometry(size, 8, 8)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }
}