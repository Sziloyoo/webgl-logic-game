import Experience from '../Experience.js'
import Environment from './Environment.js'
import Ring from './Ring.js'
import Socket from './Socket.js'
import * as THREE from 'three'

export default class World
{
    constructor({numberOfRings, socketIndexes})
    {
        // References
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
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
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('world')
        }

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.setWorldAxes()
            this.initRings(numberOfRings)
            this.initSockets(socketIndexes, numberOfRings)
        })
    }

    setWorldAxes(){
        this.origin = new THREE.AxesHelper(1)
        this.scene.add(this.origin)

        //Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.origin, 'visible')
                .name('worldOrigin')
        }
    }

    initRings(numberOfRings){
        for(let i = 1; i <= numberOfRings; i++){
            const ring = numberOfRings == i ? new Ring(i, true) : new Ring(i, false)
            this.scene.add(ring.gameObject)
            this.ringContainer.set(i, ring)
        }
    }

    initSockets(socketIndexes, numberOfRings){
        const radius = numberOfRings + 1
        for (const index of socketIndexes) {
            const angle = (index * Math.PI * 2) / 12
            const x = radius * Math.cos(angle)
            const y = radius * Math.sin(angle)

            const socket = new Socket()
            socket.gameObject.position.set(x, y, 0)
            this.scene.add(socket.gameObject)
            this.socketContainer.set(index, socket)
        }
    }

    update()
    {
        this.ringContainer.forEach((ring, index) => {
            if(ring) ring.update()
        })

        this.socketContainer.forEach((socket, index) => {
            if(socket) socket.update()
        })
    }
}