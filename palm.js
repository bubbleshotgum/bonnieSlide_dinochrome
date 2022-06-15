import {
    getCustomProperty,
    setCustomProperty, 
    incrementCustomProperty, 
} from './updateCustomProperty.js'

const speed = .09
const palm_interval_min = 1500
const palm_interval_max = 3000
const worldElem = document.querySelector('[data-world]')

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