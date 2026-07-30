while ($true) {
    Write-Host "Starting localtunnel..."
    npx localtunnel --port 5678 --subdomain betel-n8n
    Write-Host "Localtunnel crashed. Restarting in 3 seconds..."
    Start-Sleep -Seconds 3
}
