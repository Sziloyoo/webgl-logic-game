import * as THREE from 'three'

export default class Laser {
    constructor(position, angle, index) {
        // Create go
        this.gameObject = new THREE.Object3D()

        // Create laser
        this.raycaster = new THREE.Raycaster()
        this.maxRayLength = 9
        this.rayLength = this.maxRayLength
        this.rayPlane = this.createRayPlane(this.maxRayLength)
        this.rayPlane.position.copy(position)
        this.rayPlane.rotation.z = angle + Math.PI / 2
        this.gameObject.add(this.rayPlane)

        this.intersection = null

        // Raycast helper
        this.helper = new THREE.ArrowHelper(
            this.getLaserDirection(position),
            position,
            2,
            0x00FF00
        )
        //this.gameObject.add(this.helper)

        // Create collider
        this.collider = this.createCollider(0.2, true)
        this.collider.position.copy(position)
        this.collider.name = `laser-${index}`
        this.collider.userData.GO = this
        this.gameObject.add(this.collider)

        this.update = (colliderArray) => {
            // Calculate new vectors the raycaster
            const worldPosition = new THREE.Vector3()
            this.collider.getWorldPosition(worldPosition)
            const directionToOrigin = new THREE.Vector3(0, 0, 0).sub(worldPosition).normalize()

            // Update raycaster and intersections
            this.raycaster.ray.origin.copy(worldPosition)
            this.raycaster.ray.direction.copy(directionToOrigin)
            const intersections = this.raycaster.intersectObjects(colliderArray)

            // Evaluate intersections
            if (intersections.length > 0) {
                this.rayLength = intersections[0].distance // Set ray length to the nearest hit

                if(this.intersection != intersections[0].object){
                    if(this.intersection && this.intersection.userData.GO.getType() == "Socket") { this.intersection.userData.GO.deactivate() }
                    
                    this.intersection = intersections[0].object
                    if(this.intersection && this.intersection.userData.GO.getType() == "Socket") { this.intersection.userData.GO.activate() }
                }
            }
            else {
                this.rayLength = this.maxRayLength // Without intersection reset to max length

                if(this.intersection && this.intersection.userData.GO.getType() == "Socket") { this.intersection.userData.GO.deactivate() }

                this.intersection = null
            }

            // Update laser plane
            this.rayPlane.scale.set(1, this.rayLength / this.maxRayLength, 1)
            // TODO -> update laser shader!
        }

        this.getType = () => this.constructor.name
    }

    createRayPlane(maxRayLength) {
        const rayPlaneGeometry = new THREE.PlaneGeometry(0.05, maxRayLength)
        rayPlaneGeometry.translate(0, maxRayLength / 2, 0)

        const rayPlaneMesh = new THREE.Mesh(rayPlaneGeometry, new THREE.MeshBasicMaterial({ visible: true }))
        rayPlaneMesh.rotation.z = Math.PI

        return rayPlaneMesh
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.SphereGeometry(size, 8, 8)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }

    getLaserDirection(position) {
        return new THREE.Vector3(-position.x, -position.y, 0).normalize()
    }

    getAngle(index) {
        return (index * Math.PI * 2) / 12
    }
}

