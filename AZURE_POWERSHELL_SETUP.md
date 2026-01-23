# Azure PowerShell Tools Setup Guide

This guide will help you activate and use Azure PowerShell tools both locally and in GitHub Actions.

## Local Setup (Windows PowerShell)

### Step 1: Install Azure PowerShell Module

Open PowerShell as Administrator and run:

```powershell
# Install Azure PowerShell module
Install-Module -Name Az -AllowClobber -Scope CurrentUser

# If you get a prompt about NuGet provider, type 'Y' and press Enter
# If you get a prompt about untrusted repository, type 'Y' and press Enter
```

### Step 2: Verify Installation

```powershell
# Check if Azure PowerShell is installed
Get-Module -ListAvailable Az

# Import the module
Import-Module Az

# Check available commands
Get-Command -Module Az
```

### Step 3: Login to Azure

```powershell
# Login to your Azure account
Connect-AzAccount

# This will open a browser window for authentication
# After logging in, you'll see your subscription details
```

### Step 4: Set Your Subscription (if you have multiple)

```powershell
# List all subscriptions
Get-AzSubscription

# Set the active subscription
Set-AzContext -SubscriptionId "your-subscription-id"
```

### Step 5: Verify Connection

```powershell
# Check your current Azure context
Get-AzContext

# List resource groups
Get-AzResourceGroup
```

## Common Azure PowerShell Commands

### Web App Management

```powershell
# List all web apps
Get-AzWebApp

# Get specific web app details
Get-AzWebApp -ResourceGroupName "your-resource-group" -Name "OffbeatTrips"

# Deploy to web app
Publish-AzWebApp -ResourceGroupName "your-resource-group" -Name "OffbeatTrips" -ArchivePath ".\path\to\package"

# Start/Stop web app
Start-AzWebApp -ResourceGroupName "your-resource-group" -Name "OffbeatTrips"
Stop-AzWebApp -ResourceGroupName "your-resource-group" -Name "OffbeatTrips"

# Get web app publish profile
Get-AzWebAppPublishingProfile -ResourceGroupName "your-resource-group" -Name "OffbeatTrips" -OutputFile "publish-profile.xml"
```

### Resource Group Management

```powershell
# Create resource group
New-AzResourceGroup -Name "my-resource-group" -Location "East US"

# List resource groups
Get-AzResourceGroup

# Remove resource group (careful!)
Remove-AzResourceGroup -Name "my-resource-group" -Force
```

## GitHub Actions Setup

The workflow file (`.github/workflows/main_offbeattrips.yml`) has been updated to include Azure PowerShell tools.

### Required Secrets

You need to add these secrets to your GitHub repository:

1. **AZURE_CREDENTIALS** (Service Principal credentials):
   - Go to Azure Portal → Azure Active Directory → App registrations
   - Create a new app registration or use existing one
   - Create a client secret
   - Grant it Contributor role on your resource group
   - Format the secret as JSON:
   ```json
   {
     "clientId": "your-client-id",
     "clientSecret": "your-client-secret",
     "subscriptionId": "your-subscription-id",
     "tenantId": "your-tenant-id"
   }
   ```

2. **AZUREAPPSERVICE_PUBLISHPROFILE** (existing - keep this):
   - Your existing publish profile secret

### Update Workflow Configuration

Before using the PowerShell deployment, update these values in `.github/workflows/main_offbeattrips.yml`:

- Replace `'your-resource-group-name'` with your actual Azure resource group name
- Ensure `AZURE_CREDENTIALS` secret is added to your GitHub repository

## Troubleshooting

### Local Issues

**Error: "Install-Module: The term 'Install-Module' is not recognized"**
- Solution: Update PowerShell to version 5.1 or later
- Check version: `$PSVersionTable.PSVersion`

**Error: "Execution Policy"**
- Solution: Run as Administrator:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

**Error: "Unable to connect to Azure"**
- Solution: Check internet connection and try:
  ```powershell
  Connect-AzAccount -UseDeviceAuthentication
  ```

### GitHub Actions Issues

**Error: "Azure login failed"**
- Solution: Verify `AZURE_CREDENTIALS` secret is correctly formatted as JSON
- Ensure service principal has proper permissions

**Error: "Resource group not found"**
- Solution: Update the resource group name in the workflow file
- Verify the resource group exists in your Azure subscription

## Quick Reference

### Check Azure PowerShell Version
```powershell
Get-Module Az -ListAvailable | Select-Object Name, Version
```

### Update Azure PowerShell
```powershell
Update-Module -Name Az
```

### Logout from Azure
```powershell
Disconnect-AzAccount
```

### Get Help
```powershell
Get-Help Connect-AzAccount
Get-Help Get-AzWebApp
```

## Next Steps

1. Install Azure PowerShell locally using Step 1
2. Login to Azure using `Connect-AzAccount`
3. Update the workflow file with your resource group name
4. Add `AZURE_CREDENTIALS` secret to GitHub
5. Test the deployment workflow

For more information, visit: [Azure PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/azure/)
