# Comprehensive Pre-Deployment Validation Script (PowerShell)
# Runs all checks locally before deploying to Vercel
# Based on 2025 best practices for Next.js deployments

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Test-Command {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-ColorOutput Cyan "`n$('=' * 60)"
        Write-ColorOutput Blue "$Description"
    Write-ColorOutput Cyan "$('=' * 60)"
    
    try {
        $output = Invoke-Expression $Command 2>&1
        if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
            Write-ColorOutput Green "$Description - PASSED"
            return @{ Success = $true; Output = $output }
        } else {
            Write-ColorOutput Red "$Description - FAILED"
            Write-ColorOutput Red "Exit code: $LASTEXITCODE"
            return @{ Success = $false; Error = "Exit code: $LASTEXITCODE" }
        }
    } catch {
        Write-ColorOutput Red "❌ $Description - FAILED"
        Write-ColorOutput Red "Error: $($_.Exception.Message)"
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

function Test-CommonIssues {
    Write-ColorOutput Cyan "`n$('=' * 60)"
    Write-ColorOutput Blue "Checking for common deployment issues..."
    Write-ColorOutput Cyan "$('=' * 60)"
    
    $issues = @()
    
    # Check for people table references
    $peopleRefs = Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern 'from\(["'']people["'']\)' -ErrorAction SilentlyContinue | Select-Object -First 5
    if ($peopleRefs) {
        $issues += @{
            Severity = "warning"
            Message = "Found references to 'people' table (should use 'leads' table)"
            Count = $peopleRefs.Count
        }
    }
    
    # Check for non-existent tables
    $nonExistentTables = @('email_sync_logs', 'error_logs', 'email_domains')
    foreach ($table in $nonExistentTables) {
        $refs = Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern $table -ErrorAction SilentlyContinue | Select-Object -First 3
        if ($refs) {
            $issues += @{
                Severity = "error"
                Message = "Found references to non-existent table: $table"
                Count = $refs.Count
            }
        }
    }
    
    # Check for any types
    $anyTypes = Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern ': any\b' -ErrorAction SilentlyContinue
    if ($anyTypes) {
        $issues += @{
            Severity = "warning"
            Message = "Found $($anyTypes.Count) instances of 'any' type (should use specific types)"
        }
    }
    
    if ($issues.Count -gt 0) {
        Write-ColorOutput Yellow "`nIssues found:"
        foreach ($issue in $issues) {
            $icon = if ($issue.Severity -eq "error") { "[ERROR]" } else { "[WARNING]" }
            $color = if ($issue.Severity -eq "error") { "Red" } else { "Yellow" }
            Write-ColorOutput $color "$icon $($issue.Message)"
        }
        $hasErrors = ($issues | Where-Object { $_.Severity -eq "error" }).Count -gt 0
        return @{ Success = -not $hasErrors; Issues = $issues }
    }
    
    Write-ColorOutput Green "No common issues found"
    return @{ Success = $true; Issues = @() }
}

# Main execution
    Write-ColorOutput Cyan "`nStarting Pre-Deployment Validation"
Write-ColorOutput Cyan "This will run all checks locally before deploying to Vercel`n"

$results = @{
    TypeCheck = $null
    Lint = $null
    Build = $null
    CommonIssues = $null
}

# Step 1: TypeScript Type Checking
$results.TypeCheck = Test-Command "npm run type-check" "TypeScript Type Checking"

if (-not $results.TypeCheck.Success) {
    Write-ColorOutput Red "`nTypeScript errors found. Fix these before deploying."
    exit 1
}

# Step 2: Linting (non-blocking, but log warnings)
$results.Lint = Test-Command "npm run lint" "ESLint Code Quality Check"

if (-not $results.Lint.Success) {
    Write-ColorOutput Yellow "`nLinting issues found. Consider fixing these."
}

# Step 3: Check for common issues
$results.CommonIssues = Test-CommonIssues

if (-not $results.CommonIssues.Success) {
    Write-ColorOutput Red "`nCritical issues found. Fix these before deploying."
    exit 1
}

# Step 4: Local Build (most important - this is what Vercel runs)
$results.Build = Test-Command "npm run build" "Local Next.js Build (simulates Vercel build)"

if (-not $results.Build.Success) {
    Write-ColorOutput Red "`nBuild failed. This will fail on Vercel too."
    Write-ColorOutput Red "Fix the build errors above before deploying."
    exit 1
}

# Summary
Write-ColorOutput Cyan "`n$('=' * 60)"
    Write-ColorOutput Cyan "Pre-Deployment Validation Summary"
Write-ColorOutput Cyan "$('=' * 60)"

$typeCheckStatus = if ($results.TypeCheck.Success) { "PASSED" } else { "FAILED" }
$typeCheckColor = if ($results.TypeCheck.Success) { "Green" } else { "Red" }
Write-ColorOutput $typeCheckColor "TypeScript: $typeCheckStatus"

$lintStatus = if ($results.Lint.Success) { "PASSED" } else { "WARNINGS" }
$lintColor = if ($results.Lint.Success) { "Green" } else { "Yellow" }
Write-ColorOutput $lintColor "Linting: $lintStatus"

$commonIssuesStatus = if ($results.CommonIssues.Success) { "PASSED" } else { "FAILED" }
$commonIssuesColor = if ($results.CommonIssues.Success) { "Green" } else { "Red" }
Write-ColorOutput $commonIssuesColor "Common Issues: $commonIssuesStatus"

$buildStatus = if ($results.Build.Success) { "PASSED" } else { "FAILED" }
$buildColor = if ($results.Build.Success) { "Green" } else { "Red" }
Write-ColorOutput $buildColor "Build: $buildStatus"

if ($results.TypeCheck.Success -and $results.Build.Success -and $results.CommonIssues.Success) {
    Write-ColorOutput Green "`nAll checks passed! Ready to deploy to Vercel."
    Write-ColorOutput Cyan "Run: npm run deploy or vercel --prod"
    exit 0
} else {
    Write-ColorOutput Red "`nSome checks failed. Fix the issues above before deploying."
    exit 1
}

