import os
import subprocess

# Define the directory containing the .slp files and slippc executable
directory = '/home/efstathios/Documents/slippc/slippc-c30bf6998267e7f7ac40fa35443b938ccb9afa8e/'

# Change the current working directory to the directory containing the slippc executable
os.chdir(directory)

# List all .slp files in the directory
slp_files = [f for f in os.listdir(directory) if f.endswith('.slp')]

# Loop through each .slp file and run the command
for slp_file in slp_files:
    slp_file_path = os.path.join(directory, slp_file)
    # Create the output json file name
    output_json = slp_file.replace('.slp', '.json')
    output_json_path = os.path.join(directory, output_json)
    # Build the full command
    full_command = ['./slippc', '-i', slp_file_path, '-a', output_json_path]
    # Run the command
    result = subprocess.run(full_command, capture_output=True, text=True)
    # Print the result or handle it as needed
    print(f'Output for {slp_file}:')
    print(result.stdout)
    if result.stderr:
        print(f'Error for {slp_file}:')
        print(result.stderr)

print("All files processed.")