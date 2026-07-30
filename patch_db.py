import json
import uuid

db_path = r'd:\betel\vs\RedCloud\n8n_workflows\db.txt'
with open(db_path, 'r', encoding='utf-8') as f:
    d = json.loads(f.read())

# Webhook node
webhook_id = str(uuid.uuid4())
webhook_name = 'MSSQL Chat Webhook'
webhook_node = {
  "parameters": {
    "path": "mssql-ai-chat",
    "httpMethod": "POST",
    "responseMode": "responseNode",
    "options": {}
  },
  "id": webhook_id,
  "name": webhook_name,
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [200, 1000],
  "webhookId": str(uuid.uuid4())
}

# MSSQL node
sql_id = str(uuid.uuid4())
sql_name = 'Get MSSQL Schema'
sql_node = {
  "parameters": {
    "operation": "executeQuery",
    "query": "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS;",
    "options": {}
  },
  "id": sql_id,
  "name": sql_name,
  "type": "n8n-nodes-base.msSql",
  "typeVersion": 1,
  "position": [400, 1000]
}

# Code node to format schema
format_id = str(uuid.uuid4())
format_name = 'Format Schema for AI'
format_node = {
  "parameters": {
    "jsCode": "const schema = $input.all().map(i => i.json);\nreturn { json: { schema_str: JSON.stringify(schema, null, 2), question: $('MSSQL Chat Webhook').item.json.body.message || '' } };"
  },
  "id": format_id,
  "name": format_name,
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [600, 1000]
}

# Groq Node
groq_id = str(uuid.uuid4())
groq_name = 'Groq DBA AI'
groq_node = {
  "parameters": {
    "options": {
      "systemMessage": "=#= You are an expert MS SQL Database Administrator (DBA). \n\nHere is the complete MS SQL schema of the user's database: \n\n{{ $json.schema_str }}\n\nAnswer the user's question accurately. Compare existing tables with any new structures the user suggests. Suggest indexes and best practices."
    }
  },
  "id": groq_id,
  "name": groq_name,
  "type": "@n8n/n8n-nodes-langchain.lmChatGroq",
  "typeVersion": 1,
  "position": [800, 1150]
}

# AI Chain
chain_id = str(uuid.uuid4())
chain_name = 'DBA Chain'
chain_node = {
  "parameters": {
    "promptType": "define",
    "text": "={{ $json.question }}"
  },
  "id": chain_id,
  "name": chain_name,
  "type": "@n8n/n8n-nodes-langchain.chainLlm",
  "typeVersion": 1.4,
  "position": [800, 1000]
}

# Respond Webhook
respond_id = str(uuid.uuid4())
respond_name = 'Respond to MSSQL Webhook'
respond_node = {
  "parameters": {
    "respondWith": "json",
    "responseBody": "={\n  \"answer\": \"{{ $json.text }}\"\n}",
    "options": {}
  },
  "id": respond_id,
  "name": respond_name,
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1,
  "position": [1000, 1000]
}

d['nodes'].extend([webhook_node, sql_node, format_node, groq_node, chain_node, respond_node])

# Connections
d['connections'][webhook_name] = {"main": [[{"node": sql_name, "type": "main", "index": 0}]]}
d['connections'][sql_name] = {"main": [[{"node": format_name, "type": "main", "index": 0}]]}
d['connections'][format_name] = {"main": [[{"node": chain_name, "type": "main", "index": 0}]]}
d['connections'][chain_name] = {"main": [[{"node": respond_name, "type": "main", "index": 0}]]}
d['connections'][groq_name] = {"ai_languageModel": [[{"node": chain_name, "type": "ai_languageModel", "index": 0}]]}

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print('Patched db.txt with MSSQL AI Agent')
