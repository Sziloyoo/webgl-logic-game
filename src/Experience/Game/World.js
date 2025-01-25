import Experience from '../Experience.js'
import Lighting from './Lighting.js'
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

        // Debug panel
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder({
                title: 'World',
            })
        }

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.lighting = new Lighting()
            this.setWorldAxes()
            this.initRings(numberOfRings, selectedRing, ringObjects)
            this.initSockets(socketIndexes, numberOfRings, 0.45)
            this.initAssets()
        })
    }

    setWorldAxes() {
        const origin = new THREE.AxesHelper(1)
        origin.visible = false
        this.scene.add(origin)

        if (this.debug.active) {
            this.debugFolder.addBinding(origin, 'visible', { label: 'Show Axes' })
        }
    }

    initRings(numberOfRings, selectedRing, ringObjects) {
        for (let i = 1; i <= numberOfRings; i++) {
            const size = i * 1.2
            const objects = ringObjects[i]
            const ring = selectedRing == i ? new Ring(size, true, objects, this.colliders, i) : new Ring(size, false, objects, this.colliders, i)
            this.scene.add(ring.gameObject)
            this.ringContainer.set(i, ring)
        }
    }

    initSockets(socketIndexes, numberOfRings, z_offset) {
        const radius = numberOfRings + 3.075
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

    initAssets() {
        const ringModel = this.resources.items.ringModel.scene

        const atlasMaterial = new AtlasMaterial()
        const glassMaterial = new GlassMaterial()
        ringModel.children[0].material = atlasMaterial.getMaterial()
        ringModel.children[1].material = glassMaterial.getMaterial()

        this.scene.add(ringModel)
    }

    update() {
        this.ringContainer.forEach((ring, index) => {
            if (ring) ring.update(this.colliders, this.debugParams)
        })

        this.socketContainer.forEach((socket, index) => {
            if (socket) socket.update()
        })
    }
}