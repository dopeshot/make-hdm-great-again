const headline = document.querySelector("h1")

function main() {
    if(headline.textContent !== "Notenspiegel") {
        console.error("Seems like you are not on Notenspiegel.")
        return
    }
}

console.log("Make Hdm Great Again Loaded!")
main()