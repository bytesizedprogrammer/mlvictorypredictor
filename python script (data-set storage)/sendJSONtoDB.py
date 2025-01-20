import glob
import os
import json
import mysql.connector

# Connect to DB:
mydb = mysql.connector.connect(
  host="",
  user="",
  password="",
  database=""
)

print(mydb)


# first need to convert all .slp files -> .json  (this is done with convertSLPtoJSON.py)






# Get the current working directory (where your script is located)
current_dir = os.path.dirname(__file__)

# Join the current directory with the relative path to your target directory
    #target_dir = os.path.join(current_dir, "game sample sets") # ./game sample sets/   in variable target_dir, still on current_dir tho
target_dir = os.path.join(current_dir, "rizzy") 

# Change directory to the target directory containing your .json files
os.chdir(target_dir) # you're finally switched to target dir fr fr no cap



valid_stages = ["PSTADIUM", "BATTLE", "OLD PPP", "IZUMI", "STORY", "FINAL"]
# Pokemon Stadium, Battlefield, Dream Land, FoD, Yoshi's Story, FD

# List all .json files in the directory (rizzy)
for file_name in glob.glob("*.json"): # gets all files that end in .json   (can take .txt and replace extension to .json, which is what imma do assuming it works)
    with open(file_name, 'r') as file:
        json_content = json.load(file)
        
        
        if len(json_content.get('players', [])) != 2:
            print(f"Invalid because the match in '{file_name}' does not have exactly 2 players.")
            continue

        # who is port 0 & 1, and extract data from them (start frame and end frame abuse probably)
        players_data = []
        for player in json_content.get('players', []):
            player_data = {
                "tag": player.get('tag_player', ''),
                "port": player.get('port', ''),
                "char_name": player.get('char_name', ''),
                "end_stocks": player.get('end_stocks', ''),
                "end_pct": player.get('end_pct', '')
            }
            players_data.append(player_data)

        # Extract winner port
        winner_port = json_content.get('winner_port')
        original_file = json_content.get('original_file')
        stage = json_content.get('stage_name')
        match_length = json_content.get('game_length')
        end_type = json_content.get('end_type')
        
        
        # others
        quit_out = json_content.get('lras') 


        # Print the extracted data
        print(f"File name of the match's slippi file: {original_file},  File name of the JSON File: {file_name}, Winner Port: {winner_port}, Stage was: {stage}")
        for player in players_data:
            print(player)


# filtering
        if stage not in valid_stages:
            print(f"Invalid because stage '{stage}' is not in the list of valid stages.")
            continue
        
        if not any(player["tag"] == "skibidirizzler" for player in players_data):
            print(f"Bad match: {file_name} does not involve 'skibidirizzler'.")
            continue
        
        if any(player["tag"] == "SteVoUniT" for player in players_data):
            print(f"Bad match: {file_name} involves 'SteVoUniT'.")
            continue
        
        if quit_out > 0:
            print(f"Bad match: {file_name} had a Quit out")
            continue
        
        if winner_port > 1:
            print(f"Bad match: {file_name} crashed mid-match")
            continue
        
        if end_type != 2:
            print(f"No bueno: {file_name} is corrupted")
            continue
        
        if match_length < 5500:
            print(f"Invalid because match length is less than 1000.")
            continue
        
        skibidirizzler_count = sum(player["tag"] == "skibidirizzler" for player in players_data)
        if skibidirizzler_count != 1:
            print(f"Invalid because 'skibidirizzler' appears {skibidirizzler_count} times.")
            continue

        
        # Determine Who is who and extract their data (Ending stocks, Ending percent, Character, {Winner})
        if players_data[0]["tag"] == "skibidirizzler":
            # then I'm player 1
            myCharacter = players_data[0]["char_name"]
            endStocksMe = players_data[0]["end_stocks"]
            endPercentMe = players_data[0]["end_pct"]
            
            oppCharacter = players_data[1]["char_name"]
            endStocksOpp = players_data[1]["end_stocks"]
            endPercentOpp = players_data[1]["end_pct"]
            
            if endStocksMe > endStocksOpp:
                winner = "me"
            elif endStocksMe < endStocksOpp:
                winner = "opp"
            else:
                print(f"Invalid because the match in '{file_name}' ended in a tie.")
                continue
        else:
            # then I'm player 2
            myCharacter = players_data[1]["char_name"]
            endStocksMe = players_data[1]["end_stocks"]
            endPercentMe = players_data[1]["end_pct"]
            
            oppCharacter = players_data[0]["char_name"]
            endStocksOpp = players_data[0]["end_stocks"]
            endPercentOpp = players_data[0]["end_pct"]
            
            if endStocksMe > endStocksOpp:
                winner = "me"
            elif endStocksMe < endStocksOpp:
                winner = "opp"
            else:
                print(f"Invalid because the match in '{file_name}' ended in a tie.")
                continue

        if myCharacter != "LINK":
            print(f"Invalid because character '{myCharacter}' is not Link.")
            continue
        


        
         # Insert data into MySQL database
        mycursor = mydb.cursor()
        mycursor.execute("SELECT COUNT(*) FROM training_data WHERE fileName = %s", (original_file,))
        result = mycursor.fetchone()
        
        if result[0] > 0:
            print(f"File {original_file} already exists in the database.")
            continue

        # Insert data into MySQL database
        sql = """
            INSERT INTO training_data (
                ending_stocks_me, ending_stocks_opp, ending_damage_me, ending_damage_opp, stage, character_me, character_opp, fileName, winner
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        val = (
            endStocksMe, endStocksOpp, endPercentMe, endPercentOpp, stage, myCharacter, oppCharacter, original_file, winner
        )
        mycursor.execute(sql, val)
        mydb.commit()
        print(f"Inserted match into the database")

# Close the database connection
mydb.close()



















# TO-DO LIST:
    # 1) Filter the data for insertion [1) create a function that is a switch statement for what makes a file good for the db and what makes it bad   2) Implement the function over each file in the for loop and make it so it's good and properly filters *And now ur done with ur side of the deal entirely!  Steven needs to take care of the conversions and ur covered entirely!!!!]
    # 2) Ensure steven did his side (at top of file here)
    # 3) do the script to get data in real time
    # 4) Start training the model and have it use the mid-match data














# then in a new file or program, take that db content and use it train AI model, and do another thingy in that same project, in a different file, allow for running the actual model using the trained data from the first file you just mentioned


# USE PYTORCH, tensorflow is great too but...PyTorch = more popular and better


# softmax (probability of a 1 or a 0)
# logistic regression...(classification model, predcts binary outcomes, a 0/1)




# Unnecessary:
    # in context of neural networks, use a softmax function via training through filtered (or layered, whatever) neurons, outcome is a tuple, probability of 0, and of 1 {performs better, but harder to interpret in a statistical manner}
    