import Experience from '../Experience.js'
import Environment from './Environment.js'
import Ring from './Ring.js'
import * as THREE from 'three'

export default class World
{
    constructor(numberOfRings)
    {
        // References
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Game objects
        this.ringContainer = new Map()

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
            this.initScene(numberOfRings)
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

    initScene(numberOfRings){
        for(let i = 1; i <= numberOfRings; i++){
            const ring = numberOfRings == i ? new Ring(i, true) : new Ring(i, false)
            this.scene.add(ring.gameObject)
            this.ringContainer.set(i, ring)
        }
    }

    update()
    {
        this.ringContainer.forEach((ring, index) => {
            if(ring) ring.update()
        })
    }
}