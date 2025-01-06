import * as THREE from 'three'

export default class Socket{
    constructor(index){
        this.active = false

        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })

        this.gameObject = this.createStocket()
        this.gameObject.name = `socket-${index}`
        this.gameObject.userData.GO = this

        this.update = () => {
            this.gameObject.lookAt(0, 0, 0)
            if(this.active) this.gameObject.material = this.activeMaterial
            else this.gameObject.material = this.inactiveMaterial
        }

        this.setActive = () => {
            this.active = true
        }

        this.getType = () => this.constructor.name
    }

    createStocket(){
        const geometry = new THREE.BoxGeometry(.6, .6, .6)
        const material = this.inactiveMaterial
        return new THREE.Mesh(geometry, material)
    }
}