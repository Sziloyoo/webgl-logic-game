import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Socket {
    constructor(index, z_offset) {
        // Singleton
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.active = false
        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })

        this.gameObject = this.createStocket()

        // Create collider
        this.collider = this.createCollider(0.5, false)
        this.collider.position.z = -z_offset
        this.collider.name = `socket-${index}`
        this.collider.userData.GO = this
        this.gameObject.add(this.collider)

        this.update = () => {
            if (this.active) this.gameObject.children[0].material = this.activeMaterial
            else this.gameObject.children[0].material = this.inactiveMaterial
        }

        this.activate = () => this.active = true
        this.deactivate = () => this.active = false

        this.getType = () => this.constructor.name
    }

    createStocket() {
        const socketModel = this.resources.items.socketModel.scene.clone()
        socketModel.children[0].material = this.inactiveMaterial
        return socketModel
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.BoxGeometry(size, size, size)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }
}