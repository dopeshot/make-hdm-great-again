const headline = document.querySelector("h1")

function main() {
    // Safety-check
    if (headline.textContent !== "Notenspiegel") {
        console.warn("Seems like you are not on Notenspiegel.")
        return
    }

    // Get all grades
    const table = document.querySelectorAll('table')[1]
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

    const averageGrades = {
        GrundstudiumAverage: sumOfGrades.GrundstudiumNote / sumOfGrades.GrundstudiumECTS,
        hauptstudiumAverage: sumOfGrades.HauptstudiumNote / sumOfGrades.HauptstudiumECTS,
        BachelorAverage: (sumOfGrades.GrundstudiumNote + sumOfGrades.HauptstudiumNote) / (sumOfGrades.GrundstudiumECTS + sumOfGrades.HauptstudiumECTS)
    }

    const GrundstudiumWeight = 0.15
    const HauptstudiumWeight = 0.70
    const BachelorWeight = 0.15

    const prediction = {
        GradePrediction: averageGrades.GrundstudiumAverage * GrundstudiumWeight + averageGrades.hauptstudiumAverage * HauptstudiumWeight + averageGrades.BachelorAverage * BachelorWeight,
    }

    console.log(sumOfGrades)
    console.log(averageGrades)
    console.log(prediction)

    // Create container for information
    const container = document.createElement("div")
    container.style.backgroundColor = "#5381BE"
    container.style.color = "#fff"

    // Create Grade prediction text
    const list = document.createElement("p")
    const result = `Gesamt Note: ${prediction.GradePrediction.toFixed(2)}\n`
    list.textContent = result

    // Create input fields
    const inputField = document.createElement("input")
    inputField.

    container.append(inputField)
    container.append(list)
    insertAfter(container, table)

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

console.log("Make Hdm Great Again Loaded!")
main()