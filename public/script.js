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

    alert("Človek bol pridaný!")

    form.reset()
    loadPeople()
})
