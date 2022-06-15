import {
    updateSand, 
    setupSand
} from './sand.js'

import {
    updateBonnie, 
    setupBonnie, 
    getBonnieRect, 
    setBonnieLose,
    getBonnie
} from './bonnie.js'

import {updatePalm, 
    setupPalm, 
    getPalmRects,
    getPalms
} from './palm.js'
import { getCustomProperty } from './updateCustomProperty.js'


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

    checkPalmBorderFadeOnDelete()

    updatespeedScale(delta)
    updateScore()

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

function checkPalmBorderFadeOnDelete() {
    getPalms().forEach(palm => {
        if(palm.getBoundingClientRect().right < 0)
        {
            palm.remove()
            score++
        }
    })
}


function updateScore() {
    scoreElem.textContent = score
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
    const uri = "https://sheets.googleapis.com/v4/spreadsheets/1OPT9rExu4-ILrHDFHF0HZoCzVVa-_4e4rsKrmfRiXR8/values/'Записи клиентов'"
    fetch(uri + "!A:A?majorDimension=COLUMNS", {headers: {"Authorization": "Bearer ya29.a0ARrdaM_t0tkWGP3DGPhsTt_y7-upoB97yrRaBsPgfFwILDMOnYQ5ozE0zev80cJE4MM_gM4uuS5mNE1rLlckyE4rkqHoOLRmgg04sNYXPUds3KM-UGwOLf1aeyf-u_b3HROObo3uOwkLK2dmyERuVzdm0h1M"}}).then(res => res.json()).then(res => {
        const newID = res.values[0].length === 1 ? 1 : + res.values[0].at(-1) + 1
        fetch(uri + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&includeValuesInResponse=true&responseValueRenderOption=FORMATTED_VALUE&responseDateTimeRenderOption=SERIAL_NUMBER", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ya29.a0ARrdaM_t0tkWGP3DGPhsTt_y7-upoB97yrRaBsPgfFwILDMOnYQ5ozE0zev80cJE4MM_gM4uuS5mNE1rLlckyE4rkqHoOLRmgg04sNYXPUds3KM-UGwOLf1aeyf-u_b3HROObo3uOwkLK2dmyERuVzdm0h1M"
            },
            body: JSON.stringify({
                range: "'Записи клиентов'",
                majorDimension: "ROWS",
                values: [
                    [newID, "Иванов Иван Иванович", "+7 (123) 456-78-90", "ex@mple.com", score * 100]
                ]
            })
        }).then(res => res.json()).then(res => console.log(res)).catch(res => console.warn(res))
    }).catch(res => console.warn(res))
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