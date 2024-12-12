import * as THREE from 'three'

export default class Ring
{
    constructor(size)
    {
        // Materials
        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFEA00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 })

        // States
        this.active = false

        // GameObject
        this.gameObject = this.createObject(size)

        // Update function
        this.update = () => {
            if(this.active){
                this.gameObject.material = this.activeMaterial
            }
            else{
                this.gameObject.material = this.inactiveMaterial
            }
        }
    }

    createObject(size){
        const geometry = new THREE.TorusGeometry(size * 1, 0.025, 4, 64 )
        return new THREE.Mesh(geometry, this.inactiveMaterial)
    }
}