import Experience from '../Experience.js'
import Environment from './Environment.js'
import Ring from './Ring.js'
import * as THREE from 'three'

export default class World
{
    constructor()
    {
        // References
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Game obejcts
        this.ringContainer = new Array(3).fill(null)
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
            this.initScene()
        })
    }

    setWorldAxes(){
        this.origin = new THREE.AxesHelper(1)
        this.scene.add(this.origin)
        this.origin.visible = true

        //Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.origin, 'visible')
                .name('worldOrigin')
        }
    }

    initScene(){
        for(let i = 0; i < this.ringContainer.length; i++){
            const ring = new Ring(i + 1)
            this.scene.add(ring.gameObject)
            this.ringContainer[i] = ring

        }
        console.log(this.ringContainer)
    }

    update()
    {

    }
}