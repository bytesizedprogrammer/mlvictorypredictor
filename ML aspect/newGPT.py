# PACKAGES
import matplotlib.pyplot as plt
import numpy as np
import asyncio
import websockets
import json
import mysql.connector
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score
from mysql.connector import Error

# 0) Initialize the database connection
def create_connection():
    try:
        connection = mysql.connector.connect(
            host="",
            user="",
            password="",
            database=""
        )
        if connection.is_connected():
            print("Database connection successful.")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# 1) Global database connection variable
mydb = create_connection()




# 3.1) Supplementary function for train_model() to return specific data
def create_features(df):
    # Stock difference (stocks left)
    df['stock_diff'] = df['ending_stocks_me'] - df['ending_stocks_opp']
    
    # Invert the damage difference logic so that higher damage for the opponent decreases their likelihood of winning
    df['damage_diff'] = df['ending_damage_me'] - df['ending_damage_opp']  # Inverted logic
    
    # Match intensity (combination of stock difference and damage difference)
    df['match_intensity'] = abs(df['stock_diff']) * (df['damage_diff'].abs() + 1)  # Prevent zero intensity
    
    # Close match flag (binary: 1 if close, 0 if not)
    df['close_match'] = ((df['stock_diff'].abs() <= 1) & (df['damage_diff'].abs() >= 20)).astype(int)
    
    # Weighted damage and stock counts (same as before)
    df['weighted_stocks_me'] = df['ending_stocks_me'] * 0.75
    df['weighted_stocks_opp'] = df['ending_stocks_opp'] * 0.75
    df['weighted_damage_me'] = -(df['ending_damage_me'] * 0.25)
    df['weighted_damage_opp'] = -(df['ending_damage_opp'] * 0.25)
    
    return df



#3) TRAIN THE MODEL (lacks character_opp and stage here being stored to be used for reference, otherwise correct)
model = None
scaler = None
accuracy = 0.0

def train_model():
    global mydb, model, scaler, accuracy, character_opp, stage
    if not mydb or not mydb.is_connected():
        mydb = create_connection()

    mycursor = mydb.cursor()
    query = """
    SELECT ending_stocks_me, ending_stocks_opp, ending_damage_me, ending_damage_opp, stage, character_me, character_opp, winner
    FROM training_data
    WHERE character_opp = %s AND stage = %s
    """
    mycursor.execute(query, (character_opp, stage))
    results = mycursor.fetchall()
    
    # Convert results to DataFrame
    columns = ['ending_stocks_me', 'ending_stocks_opp', 'ending_damage_me', 'ending_damage_opp', 'stage', 'character_me', 'character_opp', 'winner']
    df = pd.DataFrame(results, columns=columns)
    
    # Feature engineering
    df = create_features(df)
    
    # Split data into training and test sets
    X = df[['weighted_stocks_me', 'weighted_stocks_opp', 'weighted_damage_me', 'weighted_damage_opp']]#, 'stock_diff', 'damage_diff']]  # Including stock and damage diff
    y = df['winner']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Standardize features
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    # Train the logistic regression model
    model = LogisticRegression(class_weight='balanced')
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2f}")
    
    #check_and_retrain()

    #accuracy = 0.5
    if accuracy < 0.80:
        print("Accuracy below 0.80, retraining model...")
        model, scaler, accuracy = train_model()
    else:
        print("Model accuracy is sufficient.")
    
    return model, scaler, accuracy
















#4) MODEL RUNS IN REAL TIME!
def getNumber():
    global mydb, model, scaler, accuracy, myStockCount, oppStockCount, myPercent, oppPercent
    # Prepare input for prediction as a DataFrame
    prediction_input = pd.DataFrame(
        [[(myStockCount * 0.75), (oppStockCount * 0.75), -(myPercent * 0.25), -(oppPercent * 0.25)]], 
        columns=['weighted_stocks_me', 'weighted_stocks_opp', 'weighted_damage_me', 'weighted_damage_opp']
    )

    # Ensure model and scaler are available
    if model is None or scaler is None:
        print("Model is not trained. Training now...")
        train_model()  # Call to train the model if it's not defined yet
    
    # Make prediction
    prediction = model.predict(scaler.transform(prediction_input))[0]
    win_probability = model.predict_proba(scaler.transform(prediction_input))[:, 1][0]

    # Check if the game is over based on stock count
    if myStockCount == 0:
        print("YOU LOSE!")
        with open("results.txt", "w") as file:
            file.write("You Lose!\n") # "w" (write mode) clears the file's contents (or creates the file if it doesn't exist) before writing new data.
        #with open("results.txt", "a") as file:
        #    file.write(f"You Lose!\n")
        status = "500.00"
        remove_dataset(status)
        # BETTER IDEA THAN BELOW: SQL Query to remove dataset

        # send message clearing the array of value for the graph
    elif oppStockCount == 0:
        print("YOU WIN!")
        with open("results.txt", "w") as file:
            file.write(f"You Win!\n")
        status = "200.00"
        remove_dataset(status)
        # BETTER IDEA THAN BELOW: SQL Query to remove dataset

        # send message clearing the array of value for the graph
    else:
        print(f"Predicted winner: {'Me' if prediction == 1 else 'Opponent'}, Probability of winning: {win_probability:.2f}")
        # Append win probability to results.txt
        with open("results.txt", "a") as file:
            file.write(f"{win_probability:.2f}\n")
        #print("ROCK: ", win_probability)    
        add_likelihood_to_db(win_probability)
        # BETTER IDEA THAN BELOW: SQL Query to add to dataset, have frontend run a SQL query to get latest value from db and push it and stuff


def add_likelihood_to_db(likelihoodOfLosing):
    # Create a cursor object to interact with the database
    cursor = mydb.cursor()
    
    query = """
    INSERT INTO likelihood (likelihoodOfLosing)
    VALUES (%s)
    """
    print("RIZZ: ", likelihoodOfLosing)
    trueLikelihoodOfLosing = likelihoodOfLosing * 100
    cursor.execute(query, (trueLikelihoodOfLosing,))
    mydb.commit()
    print("Likelihood of losing added to the dataset.")
    
    # Close the cursor after use
    cursor.close()

def remove_dataset(status):
    cursor = mydb.cursor()
    query = "DELETE FROM likelihood"
    cursor.execute(query)
    mydb.commit()
    print("All data removed from the likelihood table.")
    cursor.close()
    addSpecialMessage(status)


def addSpecialMessage(status):
    cursor = mydb.cursor()
    query = """
    INSERT INTO likelihood (likelihoodOfLosing)
    VALUES (%s)
    """
    cursor.execute(query, (status,))
    mydb.commit()
    #print("Likelihood of losing added to the dataset.")
    
    # Close the cursor after use
    cursor.close()





#2) # Server starting for websockets + receive the message
# Global variables
character_opp = None
stage = None
uniqueKey = ""
lastUniqueKey = None
myPercent = None
oppPercent = None
myStockCount = None
oppStockCount = None

#maybe stuff
newStockDiff = None
newDamageDiff = None
newMatchIntensity = None
closeMatchFlag = None

# whatSQLReturned = [] # can be used for optimization in future, not needed for now

#async def messageHandler(websocket, path):
#    # Example handler code
#    async for message in websocket:
#        print(f"Received: {message}")
#        await websocket.send(f"Echo: {message}")

async def messageHandler(websocket, path):
    global uniqueKey, character_opp, stage, lastUniqueKey, myPercent, oppPercent, myStockCount, oppStockCount#, whatSQLReturned  # Declare globals to update their values
    
    # Receive data from the WebSocket
    data = await websocket.recv()
    print(f"Received data: {data}")
    
    # Assuming the data is a JSON string like '{"character_opp": "Mario", "stage": "Final Destination"}'
    try:
        import json
        parsed_data = json.loads(data) 
        
        
        uniqueKey = parsed_data.get("uniqueKey", uniqueKey)
        character_opp = parsed_data.get("opp_character", character_opp)
        stage = parsed_data.get("stage", stage)


        myPercent = float(parsed_data.get("myPercent", myPercent))
        oppPercent = float(parsed_data.get("oppPercent", oppPercent))
        myStockCount = float(parsed_data.get("myStockCount", myStockCount))
        oppStockCount = float(parsed_data.get("oppStockCount", oppStockCount))

        # Real-time feature calculation
        newStockDiff = float(myStockCount - oppStockCount)
        newDamageDiff = float(myPercent - oppPercent)  # Invert this as per new logic
        
        #newMatchIntensity = abs(newStockDiff) * (abs(newDamageDiff) + 1)
        #closeMatchFlag = 1 if (abs(newStockDiff) <= 1 and abs(newDamageDiff) >= 20) else 0


        print(f"Updated global variables - character_opp: {character_opp}, stage: {stage}, uniqueKey: {uniqueKey}")
        
        if lastUniqueKey == uniqueKey:
            print("IGNORE")
            getNumber()
            # same game, so just re-run real time predictions
        else:
            print(f"lastUniqueKey: {lastUniqueKey}, uniqueKey: {uniqueKey}")
            lastUniqueKey = uniqueKey # update lastUniqueKey so game knows what ID we're using

            # new game, so run ML training function here (check if stage or opp_character is same, if so, dont re run sql, otherwise, rerun sql)
            model, scaler, accuracy = train_model()

            
    


        # Optionally, send a confirmation back to the client
        await websocket.send("Globals updated successfully!")
    except json.JSONDecodeError:
        print("Invalid data format received!")
        await websocket.send("Error: Invalid data format!")



start_server = websockets.serve(messageHandler, "localhost", 8765)
# Run the WebSocket server
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()




# PY Environment stuff:
    # https://chatgpt.com/c/678a73b1-fdf8-8008-8cfc-a424bb3511aa
