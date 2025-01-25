import { Pane } from 'tweakpane'

export default class Debug {
    constructor() {
        this.active = window.location.hash === '#debug'
        this.labelContainer = document.querySelector('#labels')
        this.labelArray = []
        this.showDebugText = true

        if (this.active) {
            this.ui = new Pane()
            this.debugFolder = this.ui.addFolder({ title: 'Debug' })
            this.debugFolder.addBinding(this, 'showDebugText', { label: 'Text' }).on('change', () => {
                if (this.labelContainer.style.display === 'none') {
                    this.labelContainer.style.display = 'block'
                } else {
                    this.labelContainer.style.display = 'none'
                }
            })
        }

        this.addLabel = (objName, objRef) => {
            const label = document.createElement('div')
            label.textContent = objName;
            this.labelContainer.appendChild(label)
            this.labelArray.push({ label: label, ref: objRef })
        }

        this.update = (camera) => {
            if(!this.showDebugText) return
            for (const { label, ref } of this.labelArray) {
                const position = ref.getWorldPos()
                position.project(camera)

                const x = (position.x * .5 + .5) * window.innerWidth;
                const y = (position.y * -.5 + .5) * window.innerHeight;
                label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`
            }
        }
    }
}