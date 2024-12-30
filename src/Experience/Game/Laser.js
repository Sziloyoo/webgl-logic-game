import * as THREE from 'three'

export default class Laser {
    constructor(ringRadius) {
        this.origin = new THREE.Object3D().position.set(0, ringRadius, 0)
        this.raycaster = new THREE.Raycaster()
        this.rayPlane = this.createRayPlane()
        this.colliders = null // TODO!

        this.update = () => {
            const newPosition = new THREE.Vector3()
            this.origin.getWorldPosition(newPosition)

            // Update raycaster
            this.raycaster.ray.origin.copy(newPosition)
            this.raycaster.ray.direction.copy(newPosition.clone().negate().normalize())

            // Test intersections
            const intersections = raycaster.intersectObjects(colliders)

            // Update the laser
            if (intersections.length > 0) {
                rayLength = intersections[0].distance // Set ray length to the nearest hit
            }
            rayPlaneMesh.scale.set(1, rayLength / maxRayLength, 1)

            // TODO -> update laser shader!
        }
    }

    createRayPlane() {
        const rayPlaneGeometry = new THREE.PlaneGeometry(1, maxRayLength)
        rayPlaneGeometry.translate(0, maxRayLength / 2, 0)

        const rayPlaneMesh = new THREE.Mesh(rayPlaneGeometry, new THREE.MeshBasicMaterial())
        rayPlaneMesh.rotation.z = Math.PI
        rayPlaneMesh.position.copy(this.origin)

        return rayPlaneMesh
    }
}

