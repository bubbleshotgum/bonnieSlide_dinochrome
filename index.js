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
const speedScale_inc = .00003

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

// setPixelToWorldScale()
// window.addEventListener('resize', setPixelToWorldScale)
const startScreenButton = document.querySelector(".start_btn")
const startScreen = document.querySelector(".start")
const resultScreen = document.querySelector(".result")
const resultPlayButton = document.querySelector(".result .play-button")
const resultFormButton = document.querySelector(".result .result_btn--two")

document.querySelector("form").addEventListener("submit", handleSubmit)

resultPlayButton.addEventListener('click', () => {
    setTimeout(() => {
        startScreenElem.textContent = "Кликните по экрану и перепрыгивайте через пальмы"
        document.addEventListener("click", handleStart, { once: true })
        startScreenElem.classList.remove("hide")

        resultScreen.classList.add("hide")
        document.querySelector(".world").classList.remove("hide")
    }, 100)
})

resultFormButton.addEventListener("click", () => {
    resultScreen.classList.add("hide")
    document.querySelector(".overlay_form").classList.remove("hide")
})

startScreenButton.addEventListener("click", () => {
    startScreenElem.textContent = "Кликните по экрану и перепрыгивайте через пальмы"
    startScreenElem.classList.remove("hide")
    startScreen.classList.add("hide")
    document.querySelector(".world").classList.remove("hide")
    setTimeout(() => {
        document.addEventListener("click", handleStart, {once: true})
    }, 500)
})



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

            if(score % 3 === 0)
            dispatchEvent(new Event("changeInterval"))
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
    dispatchEvent(new Event("resetInterval"))

    lastTime = null
    speedScale = 1
    score = 0
    
    setupSand()
    setupBonnie()
    setupPalm()

    startScreenElem.classList.add('hide')
    window.requestAnimationFrame(update)
}

function handleSubmit(e) {
    e.preventDefault()

    if(document.querySelector('input:invalid'))
    {
        const span = document.querySelector('.overlay_form-title > span')
        span.innerHTML = "Данные введены неверно<br>Проверьте правильность телефона и почты"
        span.style.color = "#dd3277"
    }
    else
        fetch("/sheets.php", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;"
            },
            body: JSON.stringify({
                name: document.querySelector("input#name").value,
                phone: document.querySelector("input#phone").value,
                email: document.querySelector("input#email").value,
                score
            })
        }).then(res => res.json()).then(() => {
            [...document.querySelectorAll("form input")].forEach(input => input.value = "")
            setTimeout(() => {    
                document.querySelector(".overlay_form").classList.add("hide")
                startScreen.classList.remove("hide")
            }, 200)
        })
}

function handleLose() {
    setBonnieLose()
    if(score === 0)
    {
        startScreenElem.textContent = "побробуйте еще раз"
        
        setTimeout(() => {
        document.addEventListener("click", handleStart, { once: true })
        startScreenElem.classList.remove("hide")
        }, 100)
    }
    else {
        resultPlayButton.setAttribute("disabled", "disabled")
        resultFormButton.setAttribute("disabled", "disabled")

        setTimeout(() => {
            resultPlayButton.removeAttribute("disabled")
            resultFormButton.removeAttribute("disabled")
        }, 1000)

        const suffix = document.querySelector(".suffix-span")
        document.querySelector(".score-number-span").textContent = score
        document.querySelector(".discount-span").textContent = score * 100
        if(score % 10 === 1 && Math.floor(score / 10) != 1)
            suffix.textContent = "у"
        else if(score % 10 < 5 && score % 10 != 0 && Math.floor(score / 10) != 1)
            suffix.textContent = "ы"
        else
            suffix.textContent = ""

        document.querySelector(".world").classList.add("hide")
        document.querySelector(".result").classList.remove("hide")

    }
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