from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

# DB connection
def get_db_connection():
    return psycopg2.connect(
        host="dpg-d7ng6mq8qa3s73a6pibg-a.oregon-postgres.render.com",
        dbname="malevelent_shrime",
        user="malevelent_shrime_user",
        password="OB2ueSq9EWwnVyMYOm4IfDZsw4qJXUa1",
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
