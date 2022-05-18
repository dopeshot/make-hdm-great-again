const list = document.createElement("p")
const headline = document.querySelector("h1")
const table = document.querySelectorAll('table')[1]
// State
let averageGrades = 0
let GrundstudiumWeight = 15
let HauptstudiumWeight = 70
let BachelorWeight = 15

function getGrades() {
    // Get all grades
    let kind = null
    const grades = [...table.querySelectorAll('tr')].reduce((accumulator, row) => {
        const firstThRow = row.querySelector('th')

        if (firstThRow !== null) {
            const isHeadline = firstThRow.colSpan === 12
            if (isHeadline) {
                kind = firstThRow.textContent
            }
            return accumulator
        }

        const data = row.querySelectorAll('td')
        const singleMark = parseFloat(data[5].textContent.replaceAll(',', '.'))

        accumulator.push({
            title: data[2].textContent.trim(),
            mark: !isNaN(singleMark) ? singleMark : null,
            status: data[6].textContent.trim(),
            ects: parseInt(data[7].textContent),
            kind
        })

        return accumulator
    }, [])

    // Grades
    console.log(grades)

    const sumOfGrades = grades.reduce((result, entry) => {
        if (entry.kind == "Grundstudium" && entry.status == "bestanden" && entry.mark != null) {
            result.GrundstudiumNote += entry.mark * entry.ects
            result.GrundstudiumECTS += entry.ects
        }

        if (entry.kind == "Hauptstudium" && entry.status == "bestanden" && entry.mark != null) {
            result.HauptstudiumNote += entry.mark * entry.ects
            result.HauptstudiumECTS += entry.ects
        }
        return result

    }, { GrundstudiumNote: 0.0, GrundstudiumECTS: 0, HauptstudiumNote: 0.0, HauptstudiumECTS: 0 })

    console.log(sumOfGrades)

    const averageGrades = {
        GrundstudiumAverage: sumOfGrades.GrundstudiumNote / sumOfGrades.GrundstudiumECTS,
        hauptstudiumAverage: sumOfGrades.HauptstudiumNote / sumOfGrades.HauptstudiumECTS,
        BachelorAverage: (sumOfGrades.GrundstudiumNote + sumOfGrades.HauptstudiumNote) / (sumOfGrades.GrundstudiumECTS + sumOfGrades.HauptstudiumECTS)
    }

    return averageGrades
}

function makePrediction(averageGrades) {
    const prediction = {
        GradePrediction: averageGrades.GrundstudiumAverage * GrundstudiumWeight/100 + averageGrades.hauptstudiumAverage * HauptstudiumWeight/100 + averageGrades.BachelorAverage * BachelorWeight/100,
    }

    return prediction
}

function updatePrediction(prediction) {
    // Create Grade prediction text
    const result = `Gesamt Note: ${prediction.GradePrediction.toFixed(2)}\n`
    list.textContent = result
}

function addHtml() {
    // Create container for information
    const container = document.createElement("div")
    container.style.backgroundColor = "#5381BE"
    container.style.color = "#fff"

    // Create input fields
    const grundstudiumSettings = document.createElement("p")
    const grundstudiumInput = document.createElement("input")
    grundstudiumInput.type = "number"
    grundstudiumInput.value = GrundstudiumWeight
    grundstudiumInput.style.alignContent = "right"
    grundstudiumInput.style.width = "50px"
    grundstudiumInput.addEventListener("change", function () { GrundstudiumWeight = grundstudiumInput.value; updatePrediction(makePrediction(averageGrades)) })
    grundstudiumSettings.textContent = `Grundstudium Gewichtung: `
    grundstudiumSettings.style.display = "inline"
    grundstudiumSettings.append(grundstudiumInput)

    const hauptstudiumSettings = document.createElement("p")
    const hauptstudiumInput = document.createElement("input")
    hauptstudiumInput.type = "number"
    hauptstudiumInput.value = HauptstudiumWeight
    hauptstudiumInput.style.alignContent = "right"
    hauptstudiumInput.style.width = "50px"
    hauptstudiumInput.addEventListener("change", function () { HauptstudiumWeight = hauptstudiumInput.value; updatePrediction(makePrediction(averageGrades)) })
    hauptstudiumSettings.textContent = `Hauptstudium Gewichtung: `
    hauptstudiumSettings.style.display = "inline"
    hauptstudiumSettings.append(hauptstudiumInput)

    const bachelorSettings = document.createElement("p")
    const bachelorInput = document.createElement("input")
    bachelorInput.type = "number"
    bachelorInput.value = BachelorWeight
    bachelorInput.style.alignContent = "right"
    bachelorInput.style.width = "50px"
    bachelorInput.addEventListener("change", function () { BachelorWeight = bachelorInput.value; updatePrediction(makePrediction(averageGrades)) })
    bachelorSettings.textContent = `Bachelor Gewichtung: `
    bachelorSettings.style.display = "inline"
    bachelorSettings.append(bachelorInput)

    container.append(grundstudiumSettings)
    container.append(hauptstudiumSettings)
    container.append(bachelorSettings)
    container.append(list)
    insertAfter(container, table)

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

function main() {
    // Safety-check
    if (headline.textContent !== "Notenspiegel") {
        console.warn("Extension does not work on this site, missing topic 'Notenspiegel'")
        return
    }

    averageGrades = getGrades()
    console.log(averageGrades)

    const prediction = makePrediction(averageGrades)
    console.log(prediction)

    updatePrediction(prediction)

    addHtml()
}

console.log("Make Hdm Great Again Loaded!")
main()