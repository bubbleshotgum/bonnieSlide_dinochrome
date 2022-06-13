import {
    getCustomProperty,
    setCustomProperty, 
    incrementCustomProperty, 
} from './updateCustomProperty.js'

const speed = .08
const sands = document.querySelectorAll('[data-sand]')

export function setupSand() {
    setCustomProperty(sands[0], "--left", 0)
    setCustomProperty(sands[1], "--left", 300)
}

export function updateSand(delta, speedScale) {
    sands.forEach(sand => {
        incrementCustomProperty(sand, "--left", delta * speedScale * speed * -1)

        if(getCustomProperty(sand, "--left") <= -300) {
            incrementCustomProperty(sand, "--left", 600)
        }
    })
}