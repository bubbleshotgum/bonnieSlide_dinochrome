import {
    getCustomProperty,
    setCustomProperty, 
    incrementCustomProperty, 
} from './updateCustomProperty.js'

const bonnieElem = document.querySelector('[data-bonnie]')
const jump_speed = .40
const gravity = .0014
const bonnie_frame_count = 4 
const frame_time = 100

let isJumping
let bonnieFrame
let currentFrameTime
let yVelocity
export function setupBonnie() {
    isJumping = false
    bonnieFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(bonnieElem, "--bottom", 5)
    document.addEventListener("mousedown", onJump)
    document.addEventListener("touchstart", onJump)
}

export function updateBonnie(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getBonnieRect() {
    return bonnieElem.getBoundingClientRect()
}

export function setBonnieLose() {
    bonnieElem.src = 'media/images/bonnie_1.png'
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        bonnieElem.src = 'media/images/bonnie1.png'
        return
    }

    if (currentFrameTime > frame_time) {
        bonnieFrame = (bonnieFrame + 1) % bonnie_frame_count
        bonnieElem.src = `media/images/bonnie_${bonnieFrame}.png`
        currentFrameTime -= frame_time
    }
    currentFrameTime += delta + speedScale
}

function handleJump(delta) {
    if(!isJumping) return
    incrementCustomProperty(bonnieElem, "--bottom", yVelocity * delta)

    if(getCustomProperty(bonnieElem, "--bottom") <= 5) {
        setCustomProperty(bonnieElem, "--bottom", 5)
        isJumping = false
    }

    yVelocity -= gravity * delta
}
function onJump(e) {
    // if(e.code !== "Space" || isJumping) return
    if(isJumping) return
    yVelocity = jump_speed
    isJumping = true
}