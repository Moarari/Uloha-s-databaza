// 🔥 Načítanie ľudí z databázy
async function loadPeople() {
    const res = await fetch("/api")
    const data = await res.json()

    const div = document.getElementById("mojDivVJs")
    div.innerHTML = ""

    data.forEach(person => {
        div.innerHTML += `
            <div class="card">
                <img src="${person.image}" alt="">
                <p><b>${person.name}</b></p>
                <p>Vek: ${person.age}</p>
                <button class="deleteBtn" onclick="deletePerson(${person.id})">Odstrániť</button>
            </div>
        `
    })
}

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
