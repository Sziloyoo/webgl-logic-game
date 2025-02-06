import * as THREE from 'three'
import Experience from '../Experience'
import AtlasMaterial from './Materials/AtlasMaterial'
import LaserMaterial from './Materials/LaserMaterial'

export default class Laser {
    constructor(position, angle, index, parentId) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.type = "Laser"

        // Create go
        this.gameObject = new THREE.Object3D()

        // Create laser
        this.raycaster = new THREE.Raycaster()
        this.maxRayLength = this.getMaxRayDistanceById(parentId)
        this.rayLength = this.maxRayLength
        this.rayPlane = this.createRayPlane(this.maxRayLength, index)
        this.rayPlane.position.copy(position)
        this.rayPlane.rotation.z = angle + Math.PI / 2
        this.gameObject.add(this.rayPlane)

        this.intersection = null

        // Create modell
        this.laserModel = this.createModel()
        this.laserModel.position.copy(position)
        this.laserModel.rotation.z = angle + Math.PI / 2
        this.gameObject.add(this.laserModel)

        // Create collider
        this.collider = this.createCollider(0.75, false)
        this.collider.position.copy(position)
        this.collider.name = `laser-${parentId}-${index}`
        this.collider.userData.GO = this
        this.gameObject.add(this.collider)

        // Debug
        if (this.debug.active) {
            this.debug.addLabel(this.collider.name, this)
        }

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

                if (this.intersection != intersections[0].object) {
                    if (this.intersection && this.intersection.userData.GO?.getType() == "Socket") { this.intersection.userData.GO?.deactivate() }

                    this.intersection = intersections[0].object
                    if (this.intersection && this.intersection.userData.GO?.getType() == "Socket") { this.intersection.userData.GO?.activate() }
                }
            }
            else {
                this.rayLength = this.maxRayLength // Without intersection reset to max length

                if (this.intersection && this.intersection.userData.GO?.getType() == "Socket") { this.intersection.userData.GO?.deactivate() }

                this.intersection = null
            }

            this.rayPlane.material.uniforms.u_color.value = this.getLaserColor(this.intersection?.userData.GO.getType())
            const beamColor = this.getBeamColor(this.intersection?.userData.GO.getType())
            this.laserModel.children[1].material.color.setRGB( beamColor.x, beamColor.y, beamColor.z )

            // Update laser plane
            this.rayPlane.scale.set(1, this.rayLength / this.maxRayLength, 1)
            this.rayPlane.material.uniforms.u_time.value = this.experience.time.elapsed / 1000
            this.rayPlane.material.uniforms.u_length.value = this.rayLength
        }

        this.getType = () => this.type
        this.getWorldPos = () => {
            const position = new THREE.Vector3()
            this.collider.getWorldPosition(position)
            return position
        }
    }

    createRayPlane(maxRayLength, index) {
        const rayPlaneGeometry = new THREE.PlaneGeometry(0.8, maxRayLength)
        rayPlaneGeometry.translate(0, maxRayLength / 2, 0)

        const laserMaterial = new LaserMaterial(maxRayLength)

        const rayPlaneMesh = new THREE.Mesh(rayPlaneGeometry, laserMaterial.getMaterial())
        rayPlaneMesh.rotation.z = Math.PI

        return rayPlaneMesh
    }

    createCollider(size, visible) {
        const boxGeometry = new THREE.BoxGeometry(size, size, size)
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, visible: visible ? true : false })

        return new THREE.Mesh(boxGeometry, colliderMaterial)
    }

    createModel() {
        const laserModel = this.resources.items.laserModel.scene.clone()
        laserModel.children[0].material = new AtlasMaterial().getMaterial()
        laserModel.children[1].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        return laserModel

    }

    getLaserDirection(position) {
        return new THREE.Vector3(-position.x, -position.y, 0).normalize()
    }

    getLaserColor(hit){
        const color = new THREE.Vector3(0.6, 0.3, 0)
        if(!hit) return color

        hit == "Socket" ? color.set(0, 1, 0) : color.set(1, 0, 0)
        return color
    }

    getBeamColor(hit){
        const color = new THREE.Vector3(1, 0.4, 0)
        if(!hit) return color

        hit == "Socket" ? color.set(0, 1, 0) : color.set(2, 0, 0)
        return color
    }

    getMaxRayDistanceById(id){
        switch(id){
            case 1: return 8.025
            case 2: return 9.225
            case 3: return 10.425
        }
        return 10
    }
}

