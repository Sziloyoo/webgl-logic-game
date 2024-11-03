import Controls from "./Controls";

export default class Game{
    constructor(){
        this.controls = new Controls()

        // Control events
        this.controls.on('up', this.upEvent)
        this.controls.on('down', this.downEvent)
        this.controls.on('left', this.leftEvent)
        this.controls.on('right', this.rightEvent)
    }

    // Events
    upEvent = () => {
        console.log("up pressed")
    }
    downEvent = () => {
        console.log("down pressed")
    }
    leftEvent = () => {
        console.log("left pressed")
    }
    rightEvent = () => {
        console.log("right pressed")
    }

    update(){
        
    }
}