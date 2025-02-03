import Experience from './Experience/Experience.js'

// Init level selector
const menu = document.getElementById("menu")
const levels = document.querySelectorAll(".level-button")
levels.forEach(levelButton => levelButton.addEventListener('click', handleLevelSelect))

// Init game
let game
let level
const container = document.getElementById("container")
const exitButton = document.getElementById("exit-button")
exitButton.addEventListener('click', handleGameExit)

// pop-up window
const popup = document.getElementById('popup');
const popupExitButton = document.getElementById('exitButton')
const nextLevelButton = document.getElementById('nextLevelButton')

function showPopup() {
    popup.style.display = 'flex'
}

popupExitButton.addEventListener('click', function () {
    handleGameExit()
})

function isNumber(value) {
    return !isNaN(value) && value.trim() !== '';
}

function handleLevelSelect(e) {
    const selectedLevelNumber = e.target.textContent.trim()
    handleGameStart(selectedLevelNumber - 1)

}

function handleGameStart(index) {
    menu.style.display = "none"
    container.style.display = "block"
    document.body.style.overflow = 'hidden'

    game = new Experience(document.querySelector('canvas.webgl'), levelList[index], showPopup)
    level = index

    // Show exit button
    exitButton.style.display = "block"
}

function handleGameExit() {
    // Close game
    game.destroy()
    game = null

    // Hide exit button and game
    exitButton.style.display = "none"
    container.style.display = "none"
    document.body.style.overflow = 'auto'

    // Reload into level select
    location.reload()
}

const levelList = [{
    socketIndexes: [3, 7, 11],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser'],
        2: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty'],
        3: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [6, 8, 10, 11],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty'],
        2: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty'],
        3: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'laser', 'empty', 'empty'],
    }
},
{
    socketIndexes: [4, 6, 7, 9],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty'],
        2: ['empty', 'empty', 'empty', 'blocker', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        3: ['empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [2, 4, 7, 9],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty'],
        2: ['blocker', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty'],
        3: ['empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [1, 2, 3, 4, 5],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser'],
        2: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'blocker', 'laser', 'empty', 'empty', 'empty'],
        3: ['empty', 'empty', 'empty', 'laser', 'blocker', 'blocker', 'blocker', 'laser', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [0, 2, 4, 9],
    ringObjects: {
        1: ['empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'laser', 'laser', 'empty', 'empty', 'empty', 'laser'],
        2: ['empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'blocker', 'empty', 'laser', 'empty', 'empty'],
        3: ['empty', 'laser', 'blocker', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [6, 7, 8, 9],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'empty', 'laser', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        2: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'blocker', 'empty'],
        3: ['empty', 'blocker', 'empty', 'laser', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [0, 2, 4, 9],
    ringObjects: {
        1: ['empty', 'laser', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        2: ['empty', 'laser', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        3: ['blocker', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty'],
    }
},
{
    socketIndexes: [1, 3, 5, 6, 8],
    ringObjects: {
        1: ['empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'blocker', 'empty'],
        2: ['empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty'],
        3: ['empty', 'laser', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'blocker'],
    }
},
{
    socketIndexes: [1, 3, 11],
    ringObjects: {
        1: ['empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        2: ['empty', 'laser', 'empty', 'laser', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        3: ['laser', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'blocker', 'empty'],
    }
},
{
    socketIndexes: [3, 4, 8, 11],
    ringObjects: {
        1: ['empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser'],
        2: ['blocker', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        3: ['empty', 'empty', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty'],
    }
},
{
    socketIndexes: [3, 5, 6, 7],
    ringObjects: {
        1: ['empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty'],
        2: ['empty', 'empty', 'laser', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        3: ['empty', 'empty', 'laser', 'laser', 'empty', 'blocker', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [1, 5, 8, 10],
    ringObjects: {
        1: ['laser', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        2: ['empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty'],
        3: ['blocker', 'empty', 'empty', 'laser', 'empty', 'empty', 'empty', 'laser', 'empty', 'empty', 'blocker', 'empty'],
    }
},
{
    socketIndexes: [0, 8, 9, 10, 11],
    ringObjects: {
        1: ['empty', 'blocker', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'laser', 'empty'],
        2: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'blocker', 'empty', 'empty', 'empty', 'laser', 'empty'],
        3: ['empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty'],
    }
},
{
    socketIndexes: [0, 2, 4, 6, 8, 10],
    ringObjects: {
        1: ['laser', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'laser', 'empty'],
        2: ['empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'empty'],
        3: ['empty', 'empty', 'empty', 'empty', 'laser', 'empty', 'laser', 'empty', 'empty', 'empty', 'empty', 'empty'],
    }
}
]

// Check path
const pathSegments = window.location.pathname.split('/')
const currentPath = pathSegments[1]
if (isNumber(currentPath)) handleGameStart(currentPath)