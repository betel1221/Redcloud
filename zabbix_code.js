// Get results from Zabbix (can be hosts or items array)
const result = $input.first().json.result || [];

if (!Array.isArray(result)) {
  console.log("⚠️ Zabbix API did not return an array");
  return [{ json: { error: "Invalid Zabbix response format" } }];
}

// Group items by host dynamically
const hostsMap = {};

result.forEach(node => {
  // Format 1: Array of hosts, each containing nested items (e.g. from host.get with selectItems)
  if (node.items && Array.isArray(node.items)) {
    const hostId = node.hostid;
    const hostName = node.name || node.host || "Unknown Server";
    
    if (!hostsMap[hostId]) {
      hostsMap[hostId] = {
        server_name: hostName,
        status: node.status === "0" || node.status === 0 ? "OPERATIONAL" : "DOWN",
        timestamp: new Date().toISOString(),
        cpu: { usage_percent: 0, threshold_critical: 85 },
        memory: { usage_percent: 0, total_mb: 0, used_mb: 0, free_mb: 0 },
        disk: { usage_percent: 0, total: "0G", used: "0G", available: "0G", threshold_critical: 90 },
        network: { rx_mb: 0, tx_mb: 0, interface: "eth0" },
        temperature_c: null,
        services: { running: 0, failed: 0 },
        uptime: "0 days, 0 hours",
        processes: 0,
        rawItems: []
      };
    }
    
    node.items.forEach(item => {
      hostsMap[hostId].rawItems.push(item);
    });
  }
  // Format 2: Array of flat items, each referencing a host (e.g. from item.get)
  else if (node.hosts && Array.isArray(node.hosts) && node.hosts[0]) {
    const hostInfo = node.hosts[0];
    const hostId = hostInfo.hostid;
    const hostName = hostInfo.name || hostInfo.host || "Unknown Server";
    
    if (!hostsMap[hostId]) {
      hostsMap[hostId] = {
        server_name: hostName,
        status: "OPERATIONAL",
        timestamp: new Date().toISOString(),
        cpu: { usage_percent: 0, threshold_critical: 85 },
        memory: { usage_percent: 0, total_mb: 0, used_mb: 0, free_mb: 0 },
        disk: { usage_percent: 0, total: "0G", used: "0G", available: "0G", threshold_critical: 90 },
        network: { rx_mb: 0, tx_mb: 0, interface: "eth0" },
        temperature_c: null,
        services: { running: 0, failed: 0 },
        uptime: "0 days, 0 hours",
        processes: 0,
        rawItems: []
      };
    }
    
    hostsMap[hostId].rawItems.push(node);
  }
});

const results = [];

// Process metrics for each host
Object.keys(hostsMap).forEach(hostId => {
  const metrics = hostsMap[hostId];
  
  metrics.rawItems.forEach(item => {
    const value = parseFloat(item.lastvalue);
    if (isNaN(value)) return;
    const key = item.key_;
    
    // CPU Metrics
    if (key.includes('cpu.util') && key.includes('idle')) {
      metrics.cpu.usage_percent = Math.round(100 - value);
    } else if (key.includes('cpu.util')) {
      metrics.cpu.usage_percent = Math.round(value);
    }
    
    // Memory Metrics
    if (key.includes('memory.size')) {
      if (key.includes('total')) {
        metrics.memory.total_mb = Math.round(value / 1024 / 1024);
      }
      if (key.includes('available') || key.includes('free')) {
        metrics.memory.free_mb = Math.round(value / 1024 / 1024);
      }
    }
    
    // Disk Metrics
    if (key.includes('fs.size')) {
      const valueGB = Math.round(value / 1024 / 1024 / 1024);
      if (key.includes('total')) {
        metrics.disk.total = valueGB + 'G';
      }
      if (key.includes('used')) {
        metrics.disk.used = valueGB + 'G';
      }
      if (key.includes('free') || key.includes('pfree')) {
        metrics.disk.available = valueGB + 'G';
      }
    }
    
    // Network Metrics
    if (key.includes('net.if.in')) {
      metrics.network.rx_mb = Math.round(value / 1024 / 1024);
    }
    if (key.includes('net.if.out')) {
      metrics.network.tx_mb = Math.round(value / 1024 / 1024);
    }
    
    // Uptime
    if (key.includes('uptime')) {
      const days = Math.floor(value / 86400);
      const hours = Math.floor((value % 86400) / 3600);
      metrics.uptime = days + ' days, ' + hours + ' hours';
    }
    
    // Temperature
    if (key.includes('temperature') || key.includes('temp')) {
      metrics.temperature_c = value;
    }
    
    // Services / Processes
    if (key.includes('services.running')) {
      metrics.services.running = Math.round(value);
    }
    if (key.includes('proc.num')) {
      metrics.processes = Math.round(value);
    }
  });
  
  // Calculate memory usage percent
  if (metrics.memory.total_mb > 0 && metrics.memory.free_mb > 0) {
    metrics.memory.used_mb = metrics.memory.total_mb - metrics.memory.free_mb;
    metrics.memory.usage_percent = Math.round((metrics.memory.used_mb / metrics.memory.total_mb) * 100);
  }
  
  // Calculate disk usage percent
  if (metrics.disk.total && metrics.disk.used) {
    const total = parseInt(metrics.disk.total);
    const used = parseInt(metrics.disk.used);
    if (!isNaN(total) && !isNaN(used) && total > 0) {
      metrics.disk.usage_percent = Math.round((used / total) * 100);
    }
  }
  
  // Determine health status
  function determineHealth(m) {
    const issues = [];
    if (m.cpu.usage_percent > 85) issues.push('High CPU');
    if (m.disk.usage_percent > 90) issues.push('Disk Full');
    if (m.temperature_c && m.temperature_c > 75) issues.push('Overheating');
    if (m.services.failed > 0) issues.push(m.services.failed + ' Failed Services');
    if (m.memory.usage_percent > 90) issues.push('High Memory Usage');
    return issues.length === 0 ? 'HEALTHY' : issues.join(', ');
  }
  
  function getStatusEmoji(m) {
    if (m.cpu.usage_percent > 85 || m.disk.usage_percent > 90) {
      return '🔴 CRITICAL';
    } else if (m.temperature_c > 75 || m.services.failed > 0) {
      return '⚠️ WARNING';
    } else {
      return '✅ HEALTHY';
    }
  }
  
  metrics.health_status = determineHealth(metrics);
  metrics.health_emoji = getStatusEmoji(metrics);
  metrics.summary = 'Server ' + metrics.server_name + ' has CPU at ' + metrics.cpu.usage_percent + '%, Memory at ' + metrics.memory.usage_percent + '%, Disk at ' + metrics.disk.usage_percent + '%, ' + metrics.services.running + ' services running.';
  metrics.natural_language = 'Server ' + metrics.server_name + ' is operational. CPU usage is ' + metrics.cpu.usage_percent + '%, memory usage is ' + metrics.memory.usage_percent + '%, disk usage is ' + metrics.disk.usage_percent + '%. There are ' + metrics.services.running + ' running services. Temperature is ' + (metrics.temperature_c || 'N/A') + '°C.';
  
  // Create unique ID
  metrics.id = 'server-' + metrics.server_name + '-' + Date.now();
  
  // SECURITY METRICS (simulated for demo)
  const security = {
    server_name: metrics.server_name,
    timestamp: new Date().toISOString(),
    failed_logins: Math.floor(Math.random() * 10),
    successful_logins: Math.floor(Math.random() * 100) + 50,
    firewall_events: Math.floor(Math.random() * 20),
    blocked_ips: Math.floor(Math.random() * 5),
    suspicious_users: Math.floor(Math.random() * 3),
    security_alerts: Math.floor(Math.random() * 2),
    authentication_activity: Math.floor(Math.random() * 150) + 50,
    risk_score: Math.floor(Math.random() * 30) + 5
  };
  
  // Calculate threat level based on risk score
  if (security.risk_score < 20) {
    security.threat_level = 'LOW';
  } else if (security.risk_score < 40) {
    security.threat_level = 'MEDIUM';
  } else if (security.risk_score < 70) {
    security.threat_level = 'HIGH';
  } else {
    security.threat_level = 'CRITICAL';
  }
  
  // Add security to metrics
  metrics.security = security;
  
  // Clean up rawItems before returning
  delete metrics.rawItems;
  
  results.push({ json: metrics });
});

return results;
