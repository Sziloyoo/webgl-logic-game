import * as THREE from 'three'
import { Color } from 'three'

export default class Ring
{
    constructor(size)
    {
        this.active = false;
        this.gameObject= this.createObject(size)

    }

    createObject(size){
        const geometry = new THREE.TorusGeometry(size * 1, 0.025, 4, 64 )
        const material = new THREE.MeshBasicMaterial({ color: new Color(0x00ff00) })
        const obj =  new THREE.Mesh(geometry, material)
        obj.rotateX(Math.PI / 2)
        
        return obj
    }
}