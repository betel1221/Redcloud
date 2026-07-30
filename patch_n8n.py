import json
import uuid
import datetime

workflow_path = r'd:\betel\vs\RedCloud\n8n_workflows\server.txt'
with open(workflow_path, 'r', encoding='utf-8') as f:
    d = json.loads(f.read())

# 1. Remove Zabbix Login, Get Metrics from Zabbix, Process Zabbix Metrics
nodes_to_remove = ['Zabbix Login', 'Get Metrics from Zabbix', 'Process Zabbix Metrics']
d['nodes'] = [n for n in d['nodes'] if n['name'] not in nodes_to_remove]

# 2. Add Generate Server Telemetry node
code = """
return [
  {
    json: {
      server_name: "prod-web-01",
      status: "OPERATIONAL",
      timestamp: new Date().toISOString(),
      cpu: { usage_percent: Math.floor(Math.random() * 30) + 10, threshold_critical: 85 },
      memory: { usage_percent: Math.floor(Math.random() * 40) + 20, total_mb: 16384, used_mb: 8192, free_mb: 8192 },
      disk: { usage_percent: Math.floor(Math.random() * 20) + 40, total: "500G", used: "250G", available: "250G", threshold_critical: 90 },
      network: { rx_mb: Math.floor(Math.random() * 50) + 10, tx_mb: Math.floor(Math.random() * 50) + 10, interface: "eth0" },
      temperature_c: Math.floor(Math.random() * 15) + 35,
      services: { running: 42, failed: 0 },
      uptime: "45 days, 12 hours",
      processes: 128,
      health_status: "HEALTHY",
      health_emoji: "🟢 HEALTHY",
      summary: "Server prod-web-01 is HEALTHY",
      natural_language: "Server prod-web-01 is operational and healthy.",
      id: "server-prod-web-01-" + Date.now(),
      security: {
        threat_level: "LOW",
        risk_score: 12
      }
    }
  },
  {
    json: {
      server_name: "prod-db-01",
      status: "OPERATIONAL",
      timestamp: new Date().toISOString(),
      cpu: { usage_percent: Math.floor(Math.random() * 40) + 40, threshold_critical: 85 },
      memory: { usage_percent: Math.floor(Math.random() * 20) + 70, total_mb: 32768, used_mb: 28000, free_mb: 4768 },
      disk: { usage_percent: Math.floor(Math.random() * 15) + 65, total: "2000G", used: "1400G", available: "600G", threshold_critical: 90 },
      network: { rx_mb: Math.floor(Math.random() * 200) + 50, tx_mb: Math.floor(Math.random() * 200) + 50, interface: "eth1" },
      temperature_c: Math.floor(Math.random() * 10) + 45,
      services: { running: 28, failed: 0 },
      uptime: "120 days, 4 hours",
      processes: 156,
      health_status: "HEALTHY",
      health_emoji: "🟢 HEALTHY",
      summary: "Server prod-db-01 is HEALTHY",
      natural_language: "Server prod-db-01 is operational and healthy.",
      id: "server-prod-db-01-" + Date.now(),
      security: {
        threat_level: "LOW",
        risk_score: 8
      }
    }
  }
];
"""

d['nodes'].append({
  'parameters': {'jsCode': code},
  'id': str(uuid.uuid4()),
  'name': 'Generate Server Telemetry',
  'type': 'n8n-nodes-base.code',
  'typeVersion': 2,
  'position': [500, 300]
})

# 3. Fix connections
if 'Zabbix Login' in d['connections'].get('Scheduler', {}).get('main', [[]])[0][0].get('node', ''):
  d['connections']['Scheduler']['main'][0] = [{'node': 'Generate Server Telemetry', 'type': 'main', 'index': 0}]
else:
  d['connections']['Scheduler'] = {'main': [[{'node': 'Generate Server Telemetry', 'type': 'main', 'index': 0}]]}

d['connections']['Generate Server Telemetry'] = {'main': [[{'node': 'Store in PostgreSQL', 'type': 'main', 'index': 0}]]}

if 'Zabbix Login' in d['connections']: del d['connections']['Zabbix Login']
if 'Get Metrics from Zabbix' in d['connections']: del d['connections']['Get Metrics from Zabbix']
if 'Process Zabbix Metrics' in d['connections']: del d['connections']['Process Zabbix Metrics']

with open(workflow_path, 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print('Successfully patched server.txt')
