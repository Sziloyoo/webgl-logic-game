import EventEmitter from "./Utils/EventEmitter"

export default class Controls extends EventEmitter{
    constructor(){
        super()

        // This prevents button spamming
        this.canPress = true

        // Touch controls
        this.startX
        this.startY
        this.endX
        this.endY

        // Controls for WASD
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

        // Controls for Arrows
        window.addEventListener('keydown', (event) => {
            if(!this.canPress) return
            switch(event.code){
                case 'ArrowUp': this.trigger('up')
                this.handleTimeout(100)
                break
                case 'ArrowLeft': this.trigger('left')
                this.handleTimeout(200)
                break
                case 'ArrowDown': this.trigger('down')
                this.handleTimeout(100)
                break
                case 'ArrowRight': this.trigger('right')
                this.handleTimeout(200)
                break
            }
        })

        // Touch controls
        window.addEventListener("touchstart", (event) => {
            this.startX = event.touches[0].clientX
            this.startY = event.touches[0].clientY
        })
        
        window.addEventListener("touchend", (event) => {
            this.endX = event.changedTouches[0].clientX
            this.endY = event.changedTouches[0].clientY
            
            this.handleSwipe()
        })
    }

    handleSwipe() {
        let diffX = this.endX - this.startX
        let diffY = this.endY - this.startY
        let absDiffX = Math.abs(diffX)
        let absDiffY = Math.abs(diffY)
    
        // Set a minimum swipe distance to avoid accidental touches
        let minSwipeDistance = 20 
    
        if (absDiffX > absDiffY && absDiffX > minSwipeDistance) {
            if (diffX > 0) {
                this.trigger('right')
                this.handleTimeout(200)
            } else {
                this.trigger('left')
                this.handleTimeout(200)
            }
        } else if (absDiffY > absDiffX && absDiffY > minSwipeDistance) {
            if (diffY > 0) {
                this.trigger('down')
                this.handleTimeout(100)
            } else {
                this.trigger('up')
                this.handleTimeout(100)
            }
        }
    }

    handleTimeout(ms){
        this.canPress = false
        setTimeout(() => {
            this.canPress = true
        }, ms)
    }
}