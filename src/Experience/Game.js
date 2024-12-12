import Controls from "./Controls";

export default class Game{
    constructor(){
        // States
        this.selectedRing = 3

        this.controls = new Controls()

        // Control events
        this.controls.on('up', this.upEvent)
        this.controls.on('down', this.downEvent)
        this.controls.on('left', this.leftEvent)
        this.controls.on('right', this.rightEvent)
    }

    // Events
    upEvent = () => {
        if(this.selectedRing >= 3) return
        this.selectedRing++
    }
    downEvent = () => {
        if(this.selectedRing <= 1) return
        this.selectedRing--
    }
    leftEvent = () => {
        console.log("left pressed")
    }
    rightEvent = () => {
        console.log("right pressed")
    }
}