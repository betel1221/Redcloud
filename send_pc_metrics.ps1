# Powershell script to fetch Windows OS telemetry and send it to N8N
$n8nUrl = "http://localhost:5678/webhook/chat-history"

Write-Host "Starting Local PC Telemetry Agent..."
Write-Host "Sending metrics to: $n8nUrl"
Write-Host "Press Ctrl+C to stop."

while ($true) {
    try {
        # Fetch CPU Usage (average of processor load)
        $cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
        if ($null -eq $cpu) { $cpu = 15.0 } # Fallback if query returns null
        
        # Fetch Memory Usage
        $mem = Get-CimInstance Win32_OperatingSystem
        $totalMem = $mem.TotalVisibleMemorySize
        $freeMem = $mem.FreePhysicalMemory
        $memUsage = [math]::Round((($totalMem - $freeMem) / $totalMem) * 100, 2)
        
        # Fetch Disk Usage
        $disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
        $diskUsage = [math]::Round((($disk.Size - $disk.FreeSpace) / $disk.Size) * 100, 2)
        
        # Format payload
        $body = @{
            operation = "store_telemetry"
            server_name = $env:COMPUTERNAME
            status = "OPERATIONAL"
            cpu_usage = $cpu
            memory_usage = $memUsage
            disk_usage = $diskUsage
            uptime = (New-TimeSpan -Start (Get-CimInstance Win32_OperatingSystem).LastBootUpTime -End (Get-Date)).ToString()
        } | ConvertTo-Json

        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Sending CPU: $cpu%, MEM: $memUsage%, DISK: $diskUsage% ..."
        
        # Send payload to N8N
        $res = Invoke-RestMethod -Uri $n8nUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
        Write-Host "Response: $res"
    } catch {
        Write-Host "Warning: Failed to fetch/send metrics: $_"
    }
    Start-Sleep -Seconds 10
}
