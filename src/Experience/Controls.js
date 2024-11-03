import EventEmitter from "./Utils/EventEmitter"

export default class Controls extends EventEmitter{
    constructor(){
        super()
        window.addEventListener('keypress', (event) => {
            switch(event.code){
                case 'KeyW': this.trigger('up')
                break
                case 'KeyA': this.trigger('left')
                break
                case 'KeyS': this.trigger('down')
                break
                case 'KeyD': this.trigger('right')
                break
            }
        })
    }
}