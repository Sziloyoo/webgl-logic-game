import EventEmitter from "./Utils/EventEmitter"

export default class Controls extends EventEmitter{
    constructor(){
        super()

        // This prevents button spamming
        this.canPress = true

        window.addEventListener('keypress', (event) => {
            if(!this.canPress) return

            switch(event.code){
                case 'KeyW': this.trigger('up')
                this.handleTimeout(100)
                break
                case 'KeyA': this.trigger('left')
                this.handleTimeout(200)
                break
                case 'KeyS': this.trigger('down')
                this.handleTimeout(100)
                break
                case 'KeyD': this.trigger('right')
                this.handleTimeout(200)
                break
            }
        })
    }

    handleTimeout(ms){
        this.canPress = false
        setTimeout(() => {
            this.canPress = true
        }, ms)
    }
}