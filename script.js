const mojDivVJs = document.getElementById("mojDivVJs")

fetch("https://Malevelent-Shrime.onrender.com/api")
    .then((resp) => resp.json())
    .then((students) => {
        console.log("Načítané dáta:", students)

        students.forEach((student) => {
            const card = document.createElement("div")
            card.className = "card"

            const img = document.createElement("img")
            img.src = student.image
            img.alt = student.name

            const name = document.createElement("p")
            name.textContent = student.name

            card.appendChild(img)
            card.appendChild(name)
            mojDivVJs.appendChild(card)
        })
    })
    .catch((err) => {
        console.error("Nastala chyba pri fetch:", err)
    })
