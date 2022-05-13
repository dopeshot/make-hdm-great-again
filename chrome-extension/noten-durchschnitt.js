const headline = document.querySelector("h1")

function main() {
    if (headline.textContent !== "Notenspiegel") {
        console.warn("Seems like you are not on Notenspiegel.")
        return
    }

    const table = document.querySelectorAll('table')[1]
    let kind = null
    const results = [...table.querySelectorAll('tr')].reduce((acc, row) => {
        const firstThRow = row.querySelector('th')

        if (firstThRow !== null) {
            const isHeadline = firstThRow.colSpan === 12
            if (isHeadline) {
                kind = firstThRow.textContent
            }
            return acc
        }

        const data = row.querySelectorAll('td')
        const singleMark = parseFloat(data[5].textContent.replaceAll(',', '.'))

        acc.push({
            title: data[2].textContent.trim(),
            mark: !isNaN(singleMark) ? singleMark : null,
            status: data[6].textContent.trim(),
            ects: parseInt(data[7].textContent),
            kind
        })

        return acc
    }, [])

    console.log(results)

    const totals = results.reduce((result, entry) => {
        if (entry.kind == "Grundstudium" && entry.status == "bestanden" && entry.mark != null) {
            result.GrStNote += entry.mark * entry.ects
            result.GrStECTS += entry.ects
        }

        if (entry.kind == "Hauptstudium" && entry.status == "bestanden" && entry.mark != null) {
            result.HpStNote += entry.mark * entry.ects
            result.HpStECTS += entry.ects
        }
        return result

    }, { GrStNote: 0.0, GrStECTS: 0, HpStNote: 0.0, HpStECTS: 0 })

    const averages = {
        GrAvg: totals.GrStNote / totals.GrStECTS,
        HpAvg: totals.HpStNote / totals.HpStECTS,
        BcAvg: (totals.GrStNote + totals.HpStNote) / (totals.GrStECTS + totals.HpStECTS)
    }

    const GrWeight = 0.15
    const HpWeight = 0.70
    const BcWeight = 0.15

    const prediction = {
        GrPred: averages.GrAvg * GrWeight + averages.HpAvg * HpWeight + averages.BcAvg * BcWeight,
    }
    console.log(totals)
    console.log(averages)
    console.log(prediction)

    const container = document.createElement("div")
    container.style.backgroundColor = "#5381BE"
    container.style.color = "#fff"
    const list = document.createElement("p")
    const result = `Gesamt Note: ${prediction.GrPred.toFixed(2)}\n`
    list.textContent = result

    container.append(list)
    insertAfter(container, table)

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

console.log("Make Hdm Great Again Loaded!")
main()