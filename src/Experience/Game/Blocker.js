import * as THREE from 'three'

export default class Blocker{
    constructor(position){
        this.gameObject = this.createBlocker()
        this.gameObject.position.copy(position)
        
        this.update = () => {
            this.gameObject.lookAt(0, 0, 0)
        }
    }

    createBlocker(){
        const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        const material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: false })
        return new THREE.Mesh(geo, material)
    }
}