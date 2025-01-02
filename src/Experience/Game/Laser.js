import * as THREE from 'three'

export default class Laser {
    constructor(position) {
        // Create go
        this.gameObject = new THREE.Object3D()
        this.gameObject.position.copy(position)

        // Create laser
        this.raycaster = new THREE.Raycaster()
        this.maxRayLength = 24
        this.rayLength = this.maxRayLength
        this.rayPlane = this.createRayPlane(this.maxRayLength)
        this.gameObject.add(this.rayPlane)

        // Raycast helper
        this.helper = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 0),             // Placeholder direction
            new THREE.Vector3(0, 0, 0),             // Placeholder origin
            2,                                      // Length of the arrow
            0x00FF00                                // Color
        )
        this.gameObject.add(this.helper)

        // Create collider
        this.collider = this.createCollider(0.2, true)
        this.gameObject.add(this.collider)

        this.update = (colliderArray) => {
            // Calculate new vectors
            const worldPosition = new THREE.Vector3()
            this.gameObject.getWorldPosition(worldPosition)

            const directionToOrigin = new THREE.Vector3(0, 0, 0).sub(worldPosition).normalize()

            // Update raycaster
            this.raycaster.ray.origin.copy(worldPosition)
            this.raycaster.ray.direction.copy(directionToOrigin)

            // Update helper
            this.helper.setDirection(directionToOrigin)

            // Test intersections
            const intersections = this.raycaster.intersectObjects(colliderArray)

            // Update the laser
            if (intersections.length > 0) {
                this.rayLength = intersections[0].distance // Set ray length to the nearest hit
            }
            this.rayPlane.scale.set(1, this.rayLength / this.maxRayLength, 1)

            // TODO -> update laser shader!
        }
    }

    createRayPlane(maxRayLength) {
        const rayPlaneGeometry = new THREE.PlaneGeometry(0.1, maxRayLength)
        rayPlaneGeometry.translate(0, maxRayLength / 2, 0)

        const rayPlaneMesh = new THREE.Mesh(rayPlaneGeometry, new THREE.MeshBasicMaterial({ visible: false }))
        rayPlaneMesh.rotation.z = Math.PI

        return rayPlaneMesh
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.SphereGeometry(size, 8, 8)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }

    lookAt(origin, target) {
        const direction = new THREE.Vector3();
        direction.subVectors(target, origin).normalize();

        return direction;
    }
}

