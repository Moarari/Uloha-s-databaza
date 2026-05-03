from flask import Flask, jsonify, request
import psycopg2
import os

app = Flask(__name__)

# DB connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT"),
        sslmode="require"
    )

@app.route("/")
def home():
    return "Vitaj v mojom prvom backende!"

@app.route("/api")
def get_all_students():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, age, image FROM people;")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    students = [
        {"id": r[0], "name": r[1], "age": r[2], "image": r[3]}
        for r in rows
    ]

    return jsonify(students)

@app.route("/api/student/<int:student_id>")
def get_student(student_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, age, image FROM people WHERE id = %s;", (student_id,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    if row:
        return jsonify({
            "id": row[0],
            "name": row[1],
            "age": row[2],
            "image": row[3]
        })

    return jsonify({"error": "Student not found"}), 404


# -------------------------
# BONUS (2b)
# -------------------------

# 1️⃣ Pridanie študenta
@app.route("/api/student", methods=["POST"])
def add_student():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO people (name, age, image) VALUES (%s, %s, %s) RETURNING id;",
        (data["name"], data["age"], data["image"])
    )

    new_id = cur.fetchone()[0]
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"status": "OK", "id": new_id})


# 2️⃣ Úprava študenta
@app.route("/api/student/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "UPDATE people SET name=%s, age=%s, image=%s WHERE id=%s;",
        (data["name"], data["age"], data["image"], student_id)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "updated"})


# 3️⃣ Vymazanie študenta
@app.route("/api/student/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM people WHERE id=%s;", (student_id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"status": "deleted"})


if __name__ == "__main__":
    app.run(debug=True)
