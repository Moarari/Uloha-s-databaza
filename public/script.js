// 🔥 Načítanie ľudí z databázy a zoradenie
async function loadPeople() {
    try {
        const res = await fetch("/api")
        let data = await res.json()

        const sortBy = document.getElementById("sortSelect").value

        // Logika zoradenia v prehliadači
        data.sort((a, b) => {
            if (sortBy === "name-asc") {
                return a.name.localeCompare(b.name) // Abeceda A-Z
            } else if (sortBy === "name-desc") {
                return b.name.localeCompare(a.name) // Abeceda Z-A
            } else if (sortBy === "age-asc") {
                return Number(a.age) - Number(b.age) // Vek od najmenšieho
            } else if (sortBy === "age-desc") {
                return Number(b.age) - Number(a.age) // Vek od najväčšieho
            } else {
                return a.id - b.id // Podľa ID (pôvodné)
            }
        })

        const div = document.getElementById("mojDivVJs")
        div.innerHTML = ""

        data.forEach(person => {
            div.innerHTML += `
                <div class="card">
                    <img src="${person.image}" alt="${person.name}">
                    <p><b>${person.name}</b></p>
                    <p>Vek: ${person.age}</p>
                    <button class="deleteBtn" onclick="deletePerson(${person.id})">Odstrániť</button>
                </div>
            `
        })
    } catch (err) {
        console.error("Chyba pri načítaní dát:", err)
    }
}

// Spustenie pri prvom načítaní
loadPeople()

// 🔥 Pridanie človeka cez formulár
const form = document.getElementById("addForm")
form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const newPerson = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        image: document.getElementById("image").value
    }

    await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerson)
    })

    form.reset()
    loadPeople()
})

// 🔥 Vymazanie človeka
async function deletePerson(id) {
    if (!confirm("Naozaj chceš odstrániť túto osobu?")) return

    await fetch(`/api/${id}`, {
        method: "DELETE"
    })

    loadPeople()
}
