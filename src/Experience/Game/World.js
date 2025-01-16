import Experience from '../Experience.js'
import Environment from './Environment.js'
import AtlasMaterial from './Materials/AtlasMaterial.js'
import GlassMaterial from './Materials/GlassMaterial.js'
import Ring from './Ring.js'
import Socket from './Socket.js'
import * as THREE from 'three'

export default class World {
    constructor({ numberOfRings, selectedRing, socketIndexes, ringObjects }) {
        // References
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.colliders = []
        this.debug = this.experience.debug

        // Game objects
        this.ringContainer = new Map()
        this.socketContainer = new Map()

        // Events
        this.rotateRing = (index, dirLeft) => {
            const ring = this.ringContainer.get(index)
            dirLeft ? ring.rotateLeft() : ring.rotateRight()
        }

        this.setRingActive = (num) => {
            this.ringContainer.forEach((ring, index) => {
                index == num ? ring.active = true : ring.active = false
            })
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('world')
        }

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.environment = new Environment()
            this.setWorldAxes()
            this.initRings(numberOfRings, selectedRing, ringObjects)
            this.initSockets(socketIndexes, numberOfRings, 0.34)
            this.initLights()
            this.initAssets()
        })
    }

    setWorldAxes() {
        this.origin = new THREE.AxesHelper(1)
        this.scene.add(this.origin)

        //Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.origin, 'visible')
                .name('worldOrigin')
        }
    }

    initRings(numberOfRings, selectedRing, ringObjects) {
        for (let i = 1; i <= numberOfRings; i++) {
            const objects = ringObjects[i]
            const ring = selectedRing == i ? new Ring(i, true, objects, this.colliders) : new Ring(i, false, objects, this.colliders)
            this.scene.add(ring.gameObject)
            this.ringContainer.set(i, ring)
        }
    }

    initSockets(socketIndexes, numberOfRings, z_offset) {
        const radius = numberOfRings + 1.45
        for (const index of socketIndexes) {
            const angle = (index * Math.PI * 2) / 12
            const x = radius * Math.cos(angle)
            const y = radius * Math.sin(angle)

            const socket = new Socket(index, z_offset)
            socket.gameObject.position.set(x, y, z_offset)
            socket.gameObject.rotation.z = angle + Math.PI / 2
            this.scene.add(socket.gameObject)
            this.socketContainer.set(index, socket)
            this.colliders.push(socket.collider)
        }
    }

    initLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x8888ff, 0.1)
        this.scene.add(ambientLight)

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
        directionalLight.position.set(1, 2, 5)
        this.scene.add(directionalLight)

        // Environment map
        const envMap = this.resources.items.envMap
        envMap.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = envMap
    }

    initAssets() {
        const ringModel = this.resources.items.ringModel.scene
        ringModel.scale.x = 3
        ringModel.scale.z = 3
        ringModel.scale.y = 3

        const atlasMaterial = new AtlasMaterial()
        const glassMaterial = new GlassMaterial()
        ringModel.children[0].material = atlasMaterial.getMaterial()
        ringModel.children[1].material = glassMaterial.getMaterial()

        this.scene.add(ringModel)
    }

    update() {
        this.ringContainer.forEach((ring, index) => {
            if (ring) ring.update(this.colliders)
        })

        this.socketContainer.forEach((socket, index) => {
            if (socket) socket.update()
        })
    }
}