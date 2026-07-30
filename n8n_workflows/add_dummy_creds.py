import os
import json
import glob

# Path to workflows
workflows_path = r'd:\betel\vs\RedCloud\n8n_workflows'
files = glob.glob(os.path.join(workflows_path, '*.*'))

def inject_creds(file_path):
    if not (file_path.endswith('.json') or file_path.endswith('.txt')):
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except:
            return
            
    modified = False
    
    for node in data.get('nodes', []):
        node_type = node.get('type', '')
        
        # Determine the credential key
        cred_key = None
        cred_name = None
        
        if node_type == 'n8n-nodes-base.postgres':
            cred_key = 'postgres'
            cred_name = 'Postgres account'
        elif node_type == 'n8n-nodes-base.microsoftSql':
            cred_key = 'microsoftSql'
            cred_name = 'Microsoft SQL Server account'
        elif node_type == '@n8n/n8n-nodes-langchain.lmChatGroq':
            cred_key = 'groqApi'
            cred_name = 'Groq API'
            
        if cred_key and cred_name:
            if 'credentials' not in node:
                node['credentials'] = {}
            if cred_key not in node['credentials'] or not node['credentials'][cred_key].get('id'):
                # We assign an empty ID and the default placeholder name
                node['credentials'][cred_key] = {
                    "id": "",
                    "name": cred_name
                }
                modified = True
                
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Injected dummy credentials into {os.path.basename(file_path)}")

for f in files:
    inject_creds(f)
