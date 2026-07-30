import os
import json
import glob

workflows_path = r'd:\betel\vs\RedCloud\n8n_workflows'
files = glob.glob(os.path.join(workflows_path, '*.*'))

def remove_creds(file_path):
    if not (file_path.endswith('.json') or file_path.endswith('.txt')):
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            return
            
    modified = False
    
    for node in data.get('nodes', []):
        if 'credentials' in node:
            del node['credentials']
            modified = True
                
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Removed credentials from {os.path.basename(file_path)}")

for f in files:
    remove_creds(f)
