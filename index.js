import {
    updateSand, 
    setupSand
} from './sand.js'

import {
    updateBonnie, 
    setupBonnie, 
    getBonnieRect, 
    setBonnieLose
} from './bonnie.js'

import {updatePalm, 
    setupPalm, 
    getPalmRects
} from './palm.js'


const world_width = 100
const world_height = 100
const speedScale_inc = .00005

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

// setPixelToWorldScale()
// window.addEventListener('resize', setPixelToWorldScale)
document.addEventListener("click", handleStart, {once: true})


let lastTime
let speedScale
let score

function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime
    
    updateSand(delta, speedScale)
    updateBonnie(delta, speedScale)
    updatePalm(delta, speedScale)

    updatespeedScale(delta)
    updateScore(delta)

    if(checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose() {
    const bonnieRect = getBonnieRect()
    return getPalmRects().some(rect => isCollision(rect, bonnieRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right
        &&
        rect1.right > rect2.left
        &&
        rect1.top < rect2.bottom
    )
}
function updateScore(delta) {
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score)
}

function updatespeedScale(delta) {
    speedScale += delta * speedScale_inc
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    
    setupSand()
    setupBonnie()
    setupPalm()

    startScreenElem.classList.add('hide')
    window.requestAnimationFrame(update)
}

function handleLose() {
    setBonnieLose()
    setTimeout(() => {
      document.addEventListener("click", handleStart, { once: true })
      startScreenElem.classList.remove("hide")
    }, 100)
  }

function setPixelToWorldScale() {
    let worldToPixelScale 
    if (window.innerWidth / window.innerHeight < world_width / world_height) {
        worldToPixelScale = window.innerWidth / world_width
    } else {
        worldToPixelScale = window.innerHeight / world_height
    }

    worldElem.style.width = `${world_width * worldToPixelScale}px`
    worldElem.style.height = `${world_height * worldToPixelScale}px`
}

window.addEventListener("contextmenu", e => e.preventDefault())