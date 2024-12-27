import * as THREE from 'three'

export default class Socket{
    constructor(){
        this.active = false

        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })

        this.gameObject = this.createStocket()

        this.update = () => {
            if(this.active) this.gameObject.material = this.activeMaterial
            else this.gameObject.material = this.inactiveMaterial
        }
    }

    createStocket(){
        const geometry = new THREE.BoxGeometry(.6, .6, .6)
        const material = this.inactiveMaterial
        return new THREE.Mesh(geometry, material)
    }
}