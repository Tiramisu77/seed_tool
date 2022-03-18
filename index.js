let words = null
const seedInputs = []
const keyInputs = []
const outputs = []

let operation = "encrypt"

async function getWords(){
let res = await fetch("/english.txt").then(r=>console.log(r))
}
                                           
getWords()

/*
function readFile(file) {
    let reader = new FileReader();
    let res = new Promise((resolve) => {
        reader.onload = function (evt) {
            resolve(evt.target.result)
        };
    })
    reader.readAsText(file);
    return res
}

document.querySelector("#file").addEventListener("change", async (e) => {
    let res = await readFile(e.target.files[0])
    words = res.split("\n")
    words.pop()
}) */

function mod(dividend, divisor) {
    const quotient = Math.floor(dividend / divisor);
    return dividend - (divisor * quotient);
}

function handleInput(event) {
    if (!words) return
    let { index, type } = event.target.dataset
    let { value } = event.target

    let value2

    if (type === "seed") {
        value2 = keyInputs[index].value
    }
    else {
        value2 = seedInputs[index].value
    }

    let wordIndex1 = words.indexOf(value)
    let wordIndex2 = words.indexOf(value2)
    if (wordIndex1 === -1 || wordIndex2 === -1) {
        outputs[index].innerText = "_______"
        return
    }

    let outputIndex
    if (operation === "encrypt") {
        outputIndex = mod((wordIndex1 + wordIndex2), words.length)
    }
    if (operation === "decrypt") {
        outputIndex = mod((wordIndex1 - wordIndex2), words.length)
    }

    let output = words[outputIndex]
    outputs[index].innerText = output


}

for (let i = 0; i < 12; i++) {
    let seedInput = document.createElement("input")
    seedInput.dataset.index = i
    seedInput.dataset.type = "seed"
    seedInput.addEventListener("input", handleInput)
    document.querySelector("#seed").appendChild(seedInput)
    seedInputs.push(seedInput)


    let keyInput = document.createElement("input")
    keyInput.dataset.index = i
    keyInput.dataset.type = "key"
    keyInput.addEventListener("input", handleInput)
    document.querySelector("#key").appendChild(keyInput)
    keyInputs.push(keyInput)

    let outputNode = document.createElement("span")
    outputNode.textContent = "_______"
    outputNode.dataset.index = i
    outputs.push(outputNode)
    document.querySelector("#output").appendChild(outputNode)
    let space = document.createElement("span")
    space.textContent = " "
    document.querySelector("#output").appendChild(space)
}

document.querySelector("#dec").addEventListener("input", () => {
    operation = "decrypt"
    for (let i = 0; i < seedInputs.length; i++) {
        seedInputs[i].dispatchEvent(new Event("input"))
    }

})

document.querySelector("#enc").addEventListener("input", () => {
    operation = "encrypt"
    for (let i = 0; i < seedInputs.length; i++) {
        seedInputs[i].dispatchEvent(new Event("input"))
    }
})

document.querySelector("#seed").firstChild.addEventListener("paste", (event) => {
    let paste = event.clipboardData.getData("text")
    if (!paste.includes(" ")) return

    let arr = paste.split(" ")
    arr.forEach((e, i) => {
        seedInputs[i].value = e
        seedInputs[i].dispatchEvent(new Event("input"))
    })

    event.preventDefault()
})

document.querySelector("#key").firstChild.addEventListener("paste", (event) => {
    let paste = event.clipboardData.getData("text")
    if (!paste.includes(" ")) return

    let arr = paste.split(" ")
    arr.forEach((e, i) => {
        keyInputs[i].value = e
        keyInputs[i].dispatchEvent(new Event("input"))
    })

    event.preventDefault()
})

document.querySelector("#clear_seed").addEventListener("click", () => {
    seedInputs.forEach(e => {
        e.value = ""
        e.dispatchEvent(new Event("input"))
    })
})

document.querySelector("#clear_key").addEventListener("click", () => {
    keyInputs.forEach(e => {
        e.value = ""
        e.dispatchEvent(new Event("input"))
    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function randomSeed() {
    return new Array(12).fill().map(() =>
        words[getRandomInt(0, words.length)]
    ).join(" ")
}

