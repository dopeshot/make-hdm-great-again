// const results = 

const totals = results.reduce((result,entry) => {
    if(entry.kind == "Grundstudium" && entry.status == "bestanden" && entry.mark != null){
        result.GrStNote += entry.mark * entry.ects
        result.GrStECTS += entry.ects
    }

    if(entry.kind == "Hauptstudium" && entry.status == "bestanden" && entry.mark != null){
        result.HpStNote += entry.mark * entry.ects
        result.HpStECTS += entry.ects
    }
    return result
    
}, {GrStNote: 0.0, GrStECTS: 0, HpStNote: 0.0, HpStECTS: 0})

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
console.log(prediction);