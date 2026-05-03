const mojDivVJs = document.getElementById("mojDivVJs")

fetch("https://TVOJ-BACKEND.onrender.com/api")
    .then(resp => resp.json())
    .then(data => {
        mojDivVJs.innerHTML = ""

        data.forEach(person => {
            const card = document.createElement("div")
            card.className = "card"

            const img = document.createElement("img")
            img.src = person.image

            const name = document.createElement("p")
            name.textContent = person.name

            const age = document.createElement("p")
            age.textContent = `Vek: ${person.age}`

            card.appendChild(img)
            card.appendChild(name)
            card.appendChild(age)

            mojDivVJs.appendChild(card)
        })
    })
    .catch(err => {
        console.error("Chyba pri fetchnutí:", err)
        mojDivVJs.innerHTML = "<p>Chyba pri načítaní dát.</p>"
    })
