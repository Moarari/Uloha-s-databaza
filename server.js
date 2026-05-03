import express from "express"
import pkg from "pg"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())

// Potrebné pre správne cesty v ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 🔥 Servovanie frontendu z priečinka public
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// 🔥 Render PostgreSQL pripojenie
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

// 🔥 GET /api – vráti všetkých ľudí
app.get("/api", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM people ORDER BY id ASC")
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Database error" })
    }
})

// 🔥 BONUS: POST /api – pridá človeka
app.post("/api", async (req, res) => {
    const { name, age, image } = req.body
    try {
        const result = await pool.query(
            "INSERT INTO people (name, age, image) VALUES ($1, $2, $3) RETURNING *",
            [name, age, image]
        )
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Insert error" })
    }
})

// 🔥 DELETE /api/:id – vymaže človeka podľa ID
app.delete("/api/:id", async (req, res) => {
    const id = req.params.id

    try {
        await pool.query("DELETE FROM people WHERE id = $1", [id])
        res.json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Delete error" })
    }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log("Server beží na porte " + port))
