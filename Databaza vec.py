from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

# DB connection
def get_db_connection():
    return psycopg2.connect(
        host="postgresql://malevelent_shrime2_user:ExQmAecmZon2NU33csSjMhnLFwHYOzkb@dpg-d7rm5nnavr4c73a2mr7g-a/malevelent_shrime2",
        dbname="malevelent_shrime2",
        user="malevelent_shrime2_user",
        password="ExQmAecmZon2NU33csSjMhnLFwHYOzkb",
        port=5432,
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

    students = []
    for row in rows:
        students.append({
            "id": row[0],
            "name": row[1],
            "age": row[2],
            "image": row[3]
        })

    return jsonify(students)

@app.route("/api/student/<int:student_id>")
def get_student(student_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, name, age, image FROM people WHERE id = %s;",
        (student_id,)
    )
    row = cur.fetchone()

    cur.close()
    conn.close()

    if row:
        student = {
            "id": row[0],
            "name": row[1],
            "age": row[2],
            "image": row[3]
        }
        return jsonify(student)

    return jsonify({"error": "Student not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
