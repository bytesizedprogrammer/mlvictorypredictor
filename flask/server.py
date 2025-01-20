#import logging
from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# MySQL connection details
DB_HOST = ''
DB_USER = ''
DB_PASSWORD = ''
DB_NAME = ''

def get_db_connection():
    # Establish a connection to the MySQL database.
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None



@app.route('/receivelikelihood', methods=['GET'])
def fetch_data():
    #print("PINGED!!!")
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT likelihoodOfLosing FROM likelihood ORDER BY id DESC LIMIT 1"
        ) # ^^ fetches current likelihood of winning
        data = cursor.fetchall()

       
        return jsonify({"data": data, "message": ""})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()



if __name__ == '__main__':
    app.run(debug=True)
