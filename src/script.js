import Experience from './Experience/Experience.js'

// Init level selector
const menu = document.getElementById("menu")
const levels = document.querySelectorAll(".level-button")
levels.forEach(levelButton => levelButton.addEventListener('click', handleLevelSelect))

// Init game
let game
const container = document.getElementById("container")
const exitButton = document.getElementById("exit-button")
exitButton.addEventListener('click', handleGameExit)



function handleLevelSelect(e) {
    const selectedLevelNumber = e.target.textContent.trim()
    menu.style.display = "none"
    container.style.display = "block"

    game = new Experience(document.querySelector('canvas.webgl'), gameState)

    // Show exit button
    exitButton.style.display = "block"
}

function handleGameExit(){
    // Close game
    game.destroy()
    game = null

    // Hide exit button and game
    exitButton.style.display = "none"
    container.style.display = "none"

    // Reload into level select
    location.reload()
}

const gameState = {
    numberOfRings: 3,
    selectedRing: 3,
    socketIndexes: [0, 2, 4, 9],
    ringObjects: {
        1: ['empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'laser', 'laser', 'empty', 'empty', 'empty', 'laser'],
        2: ['empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'blocker', 'empty', 'laser', 'empty', 'empty'],
        3: ['empty', 'laser', 'blocker', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    }
}