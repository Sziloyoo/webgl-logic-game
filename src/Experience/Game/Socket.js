import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Socket {
    constructor(index, z_offset) {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.active = false

        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })

        this.gameObject = this.createStocket()

        // Create collider
        this.collider = this.createCollider(0.1, false)
        this.collider.position.z = -z_offset/4
        this.collider.name = `socket-${index}`
        this.collider.userData.GO = this
        this.gameObject.add(this.collider)

        this.update = () => {
            //this.gameObject.lookAt(0, 0, 0)
            if (this.active) this.gameObject.children[0].material = this.activeMaterial
            else this.gameObject.children[0].material = this.inactiveMaterial
        }

        this.activate = () => this.active = true
        this.deactivate = () => this.active = false

        this.getType = () => this.constructor.name
    }

    createStocket() {
        const socketModel = this.resources.items.socketModel.scene.clone()

        socketModel.scale.x = 3
        socketModel.scale.z = 3
        socketModel.scale.y = 3

        socketModel.children[0].material = this.inactiveMaterial
        return socketModel
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.SphereGeometry(size, 8, 8)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }
}