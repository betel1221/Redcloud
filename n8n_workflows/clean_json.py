import os
import json
import glob

def clean_credentials(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Try to parse as JSON
            try:
                data = json.loads(content)
            except json.JSONDecodeError:
                print(f"Skipping {filepath} - Not valid JSON")
                return

            if "nodes" in data:
                modified = False
                for node in data["nodes"]:
                    if "credentials" in node:
                        del node["credentials"]
                        modified = True
                
                if modified:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2)
                    print(f"Cleaned {filepath}")
                else:
                    print(f"No credentials found in {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

folder = "d:/betel/vs/RedCloud/n8n_workflows"
for ext in ["*.json", "*.txt"]:
    for filepath in glob.glob(os.path.join(folder, ext)):
        clean_credentials(filepath)
