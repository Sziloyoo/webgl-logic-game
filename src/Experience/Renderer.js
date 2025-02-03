import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import Experience from './Experience.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()

        // Post processing
        this.renderScene = new RenderPass(this.scene, this.camera.instance)
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height), 0.25, 0.1, 0.4)
        this.outputPass = new OutputPass()

        this.composer = new EffectComposer(this.instance)
        this.composer.addPass(this.renderScene)
        this.composer.addPass(this.bloomPass)
        this.composer.addPass(this.outputPass)

        // Debug
        this.debug = this.experience.debug
        if (this.debug.active) this.createDebugFolder()

        // Full screen
        this.handeDbClick = this.handeDbClick.bind(this)
        window.addEventListener('dblclick', this.handeDbClick)
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false
        })
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.0
        this.instance.setClearColor('#000000')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        //this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setPixelRatio(1)
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        //this.instance.render(this.scene, this.camera.instance)
        this.composer.render()
    }

    createDebugFolder() {
        this.debugFolder = this.debug.ui.addFolder({
            title: 'Post Processing',
        })
        this.debugFolder.addBinding(this.bloomPass, 'strength', { label: 'Strenght', min: 0, max: 2 })
        this.debugFolder.addBinding(this.bloomPass, 'radius', { label: 'Radius', min: 0, max: 1 })
        this.debugFolder.addBinding(this.bloomPass, 'threshold', { label: 'Treshold', min: 0, max: 1 })
        this.debugFolder.addBinding(this.instance, 'toneMappingExposure', { label: 'Exposure', min: 0, max: 2 })
    }

    handeDbClick(){
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

        if (!fullscreenElement) {
            if (this.canvas.requestFullscreen) {
                this.canvas.requestFullscreen()
            }
            else if (this.canvas.webkitRequestFullscreen) {
                this.canvas.webkitRequestFullscreen()
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            }
        }
    }

    dispose(){
        this.instance.dispose()
        window.removeEventListener('dblclick', this.handeDbClick)
    }
}