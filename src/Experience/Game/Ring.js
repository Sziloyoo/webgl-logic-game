import * as THREE from 'three'
import gsap from 'gsap'

export default class Ring {
    constructor(size, defaultSelected) {
        // Materials
        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFEA00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00, wireframe: true })

        // States
        this.active = defaultSelected ? true : false

        // GameObject
        this.gameObject = this.createObject(size, defaultSelected)

        // Rotate events
        this.rotateLeft = () => {
            gsap.to(this.gameObject.rotation, {
                duration: .3,
                z: this.gameObject.rotation.z + Math.PI / 6,
                ease: 'power2.inOut'
            })
        }

        this.rotateRight = () => {
            gsap.to(this.gameObject.rotation, {
                duration: .3,
                z: this.gameObject.rotation.z - Math.PI / 6,
                ease: 'power2.inOut'
            })
        }

        // Update function
        this.update = () => {
            if (this.active) {
                this.gameObject.material = this.activeMaterial
            }
            else {
                this.gameObject.material = this.inactiveMaterial
            }
        }
    }

    createObject(size, defaultSelected) {
        const geometry = new THREE.TorusGeometry(size * 1, 0.025, 4, 64)
        const material = defaultSelected ? this.activeMaterial : this.inactiveMaterial
        return new THREE.Mesh(geometry, material)
    }
}