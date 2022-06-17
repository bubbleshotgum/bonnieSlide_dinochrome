import {
    setCustomProperty, 
    incrementCustomProperty, 
} from './updateCustomProperty.js'

const speed = .1

const initial_palm_interval_min = 1500
const initial_palm_interval_max = 2700

let 
    palm_interval_min = initial_palm_interval_min,
    palm_interval_max = initial_palm_interval_max
const worldElem = document.querySelector('[data-world]')

window.addEventListener('changeInterval', () => {
    palm_interval_min -= palm_interval_min > 500 ? 100 : 0
    palm_interval_max -= palm_interval_max > 800 ? 300 : 0
})

window.addEventListener('resetInterval', () => {
    palm_interval_min = initial_palm_interval_min
    palm_interval_max = initial_palm_interval_max
})

let nextPalmTime = null
export function setupPalm() {
    nextPalmTime = palm_interval_min
    document.querySelectorAll('[data-palm]').forEach(palm => {
        palm.remove()
    })
}

export function updatePalm(delta, speedScale) {
    document.querySelectorAll('[data-palm]').forEach(palm => {
        incrementCustomProperty(palm, "--left", delta * speedScale * speed * - 1)
    })

    if (nextPalmTime <= 0) {
        createPalm()
        nextPalmTime = randomNumberBetween(palm_interval_min, palm_interval_max) / speedScale
    }
    nextPalmTime -= delta
}

export function getPalmRects() {
    return getPalms().map(palm => {
        return palm.getBoundingClientRect()
    })
}

export function getPalms() {
    return [...document.querySelectorAll('[data-palm]')]
}

function createPalm() {
    const palm = document.createElement('img')
    palm.dataset.palm = true
    palm.src = 'media/images/palm1.png'
    palm.classList.add('palm')
    setCustomProperty(palm, "--left", 100)
    worldElem.append(palm)
}
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}