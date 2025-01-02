import * as THREE from 'three'
import gsap from 'gsap'
import Laser from './Laser'
import Blocker from './Blocker'

export default class Ring {
    constructor(size, defaultSelected, objects, colliderArray) {
        // Materials
        this.activeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFEA00 })
        this.inactiveMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 })

        // States
        this.active = defaultSelected ? true : false
        this.size = size

        // GameObject
        this.gameObject = this.createRing(size, defaultSelected)

        // List of objects
        this.objectContainer = new Map()
        this.createObjects(objects, colliderArray)

        // Rotate events
        this.rotateLeft = () => {
            gsap.to(this.gameObject.rotation, {
                duration: .2,
                z: this.gameObject.rotation.z + Math.PI / 6,
                ease: 'power2.inOut'
            })
        }

        this.rotateRight = () => {
            gsap.to(this.gameObject.rotation, {
                duration: .2,
                z: this.gameObject.rotation.z - Math.PI / 6,
                ease: 'power2.inOut'
            })
        }

        // Update function
        this.update = (colliderArray) => {
            // update ring material
            if (this.active) {
                this.gameObject.material = this.activeMaterial
            }
            else {
                this.gameObject.material = this.inactiveMaterial
            }

            // update objects
            this.objectContainer.forEach((item, index) => {
                if(item) item.update(colliderArray)
            })
        }
    }

    createRing(size, defaultSelected) {
        const geometry = new THREE.TorusGeometry(size * 1, 0.025, 4, 64)
        const material = defaultSelected ? this.activeMaterial : this.inactiveMaterial
        return new THREE.Mesh(geometry, material)
    }

    createObjects(objects, colliderArray) {
        for (let i = 1; i <= 12; i++) {
            // Get object name
            const objName = objects[i - 1]
            if (objName == "empty") continue

            // Create game objects
            const obj = this.createSingleObject(objName, i)
            this.objectContainer.set(i, obj)
            this.gameObject.add(obj.gameObject)

            // Add colliders into the collider array
            if(objName == "blocker") colliderArray.push(obj.gameObject)
            if(objName == "laser") colliderArray.push(obj.collider)
        }
    }

    createSingleObject(objectName, index) {
        switch (objectName) {
            case "blocker":
                return new Blocker(this.getPosition(index))
                break
            case "laser":
                return new Laser(this.getPosition(index))
                break
        }
    }

    getPosition(index) {
        const angle = (index * Math.PI * 2) / 12
        const x = this.size * Math.cos(angle)
        const y = this.size * Math.sin(angle)

        return new THREE.Vector3(x, y, 0)

    }
}