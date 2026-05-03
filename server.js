import express from "express"
import pkg from "pg"
import cors from "cors"

const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())

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

const port = process.env.PORT || 3000
app.listen(port, () => console.log("Server beží na porte " + port))
