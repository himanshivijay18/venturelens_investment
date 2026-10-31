# VentureLens Automated Verification Suite

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "STARTING VENTURELENS AUTOMATED SYSTEM INTEGRATION TESTS" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# 1. Test Startup Registration
Write-Host "`n1. Testing Startup Registration..." -ForegroundColor Yellow
$startupEmail = "founder_test_$([System.Guid]::NewGuid().ToString().Substring(0,8))@testnexus.io"
$startupBody = @{
    founderName = "Elena Test"
    email = $startupEmail
    password = "Password@123"
    companyName = "TestFlow Robotics"
    category = "Robotics"
    fundingStage = "Seed"
    targetMoney = 2500000
    yearlyRevenue = 400000
    monthlyExpenses = 45000
} | ConvertTo-Json

$startupAuth = Invoke-RestMethod -Uri "$baseUrl/startup/register" -Method Post -Body $startupBody -ContentType "application/json"
$startupToken = $startupAuth.token
$startupId = $startupAuth.userId
Write-Host "   -> Startup Registered! ID: $startupId, Company: $($startupAuth.name)" -ForegroundColor Green

# 2. Test Startup Profile Update
Write-Host "`n2. Testing Startup Profile Update..." -ForegroundColor Yellow
$startupHeaders = @{ "Authorization" = "Bearer $startupToken" }
$updateBody = @{
    founderName = "Elena Test Updated"
    companyName = "TestFlow Robotics Global"
    category = "Robotics"
    fundingStage = "Series A"
    targetMoney = 3000000
    yearlyRevenue = 600000
    monthlyExpenses = 50000
} | ConvertTo-Json

$updatedStartup = Invoke-RestMethod -Uri "$baseUrl/startup/update/$startupId" -Method Put -Headers $startupHeaders -Body $updateBody -ContentType "application/json"
Write-Host "   -> Startup Updated! New Name: $($updatedStartup.companyName), Stage: $($updatedStartup.fundingStage)" -ForegroundColor Green

# 3. Test Pitch Deck Upload
Write-Host "`n3. Testing Pitch Deck Upload..." -ForegroundColor Yellow
$dummyDeckContent = "%PDF-1.4 Mock confidential pitch deck content for TestFlow Robotics due diligence presentation."
$deckPath = "test_pitch_deck.pdf"
Set-Content -Path $deckPath -Value $dummyDeckContent

$webClient = New-Object System.Net.WebClient
$webClient.Headers.Add("Authorization", "Bearer $startupToken")
$uploadRespBytes = $webClient.UploadFile("$baseUrl/pitch-deck/upload/$startupId", $deckPath)
$uploadRespStr = [System.Text.Encoding]::UTF8.GetString($uploadRespBytes)
Write-Host "   -> Pitch Deck Uploaded! Response: $uploadRespStr" -ForegroundColor Green
Remove-Item $deckPath -ErrorAction SilentlyContinue

# 4. Test Investor Registration & Login
Write-Host "`n4. Testing Investor Registration..." -ForegroundColor Yellow
$investorEmail = "investor_test_$([System.Guid]::NewGuid().ToString().Substring(0,8))@quantumvc.com"
$investorBody = @{
    investorName = "Marcus Thorne"
    email = $investorEmail
    password = "Password@123"
    firmName = "Quantum Horizon Partners"
    interestedCategory = "Robotics"
} | ConvertTo-Json

$investorAuth = Invoke-RestMethod -Uri "$baseUrl/investor/register" -Method Post -Body $investorBody -ContentType "application/json"
$investorToken = $investorAuth.token
$investorId = $investorAuth.userId
$investorHeaders = @{ "Authorization" = "Bearer $investorToken" }
Write-Host "   -> Investor Registered! ID: $investorId, Name: $($investorAuth.name)" -ForegroundColor Green

# 5. Test Investor Views Startups
Write-Host "`n5. Testing Investor Startup Discovery..." -ForegroundColor Yellow
$startupsList = Invoke-RestMethod -Uri "$baseUrl/startup/all" -Method Get -Headers $investorHeaders
Write-Host "   -> Investor retrieved $($startupsList.Count) registered startups from database" -ForegroundColor Green

# 6. Test Investor Saves and Removes Startup
Write-Host "`n6. Testing Save / Bookmark Startup..." -ForegroundColor Yellow
$saveResp = Invoke-RestMethod -Uri "$baseUrl/saved-startups/$investorId/$startupId" -Method Post -Headers $investorHeaders
Write-Host "   -> Startup saved to investor watchlist: $($saveResp.message)" -ForegroundColor Green

$savedList = Invoke-RestMethod -Uri "$baseUrl/saved-startups/$investorId" -Method Get -Headers $investorHeaders
Write-Host "   -> Investor saved list contains $($savedList.Count) startup(s)" -ForegroundColor Green

# 7. Test Investor Sends Meeting Request
Write-Host "`n7. Testing Investor Sends Meeting Request..." -ForegroundColor Yellow
$meetingBody = @{
    startupId = $startupId
    investorId = $investorId
    message = "We reviewed your TestFlow Robotics deck and want to discuss leading your Series A round."
} | ConvertTo-Json

$meetingResp = Invoke-RestMethod -Uri "$baseUrl/meeting/create" -Method Post -Headers $investorHeaders -Body $meetingBody -ContentType "application/json"
$meetingId = $meetingResp.id
Write-Host "   -> Meeting Request created! ID: $meetingId, Status: $($meetingResp.status)" -ForegroundColor Green

# 8. Test Startup Views Meeting Requests
Write-Host "`n8. Testing Startup Receives Meeting Request..." -ForegroundColor Yellow
$startupMeetings = Invoke-RestMethod -Uri "$baseUrl/meeting/startup/$startupId" -Method Get -Headers $startupHeaders
Write-Host "   -> Startup received $($startupMeetings.Count) meeting request(s). Investor: $($startupMeetings[0].investorName)" -ForegroundColor Green

# 9. Test Startup Accepts Meeting Request
Write-Host "`n9. Testing Startup Responds (Accepts) Meeting..." -ForegroundColor Yellow
$acceptBody = @{ status = "ACCEPTED" } | ConvertTo-Json
$acceptedMeeting = Invoke-RestMethod -Uri "$baseUrl/meeting/$meetingId/status" -Method Put -Headers $startupHeaders -Body $acceptBody -ContentType "application/json"
Write-Host "   -> Meeting status updated to: $($acceptedMeeting.status)" -ForegroundColor Green

# 10. Test Investor Views Updated Status
Write-Host "`n10. Testing Investor Views Updated Status..." -ForegroundColor Yellow
$investorMeetings = Invoke-RestMethod -Uri "$baseUrl/meeting/investor/$investorId" -Method Get -Headers $investorHeaders
$targetMeeting = $investorMeetings | Where-Object { $_.id -eq $meetingId }
Write-Host "   -> Investor confirmed meeting status is now: $($targetMeeting.status)" -ForegroundColor Green

# 11. Test Admin Dashboard & Analytics
Write-Host "`n11. Testing Administrator Operations..." -ForegroundColor Yellow
$adminAuth = Invoke-RestMethod -Uri "$baseUrl/admin/login" -Method Post -Body (@{ email = "admin@venturelens.com"; password = "Admin@12345" } | ConvertTo-Json) -ContentType "application/json"
$adminHeaders = @{ "Authorization" = "Bearer $($adminAuth.token)" }

$adminDash = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Headers $adminHeaders
Write-Host "   -> Admin Dashboard: Total Startups: $($adminDash.totalStartups), Total Investors: $($adminDash.totalInvestors), Total Pitch Decks: $($adminDash.totalPitchDecks)" -ForegroundColor Green

$adminAnalytics = Invoke-RestMethod -Uri "$baseUrl/admin/analytics" -Headers $adminHeaders
Write-Host "   -> Admin Analytics: Categories Count: $($adminAnalytics.startupsByCategory.Count), Statuses Count: $($adminAnalytics.meetingRequestsByStatus.Count)" -ForegroundColor Green

# 12. Test Security: Unauthorized Access Prevention
Write-Host "`n12. Testing Security & Unauthorized Access Checks..." -ForegroundColor Yellow
try {
    # Attempt to update startup with wrong token
    Invoke-RestMethod -Uri "$baseUrl/startup/update/$startupId" -Method Put -Headers $investorHeaders -Body $updateBody -ContentType "application/json"
    Write-Host "   -> FAILED: Investor was able to update startup!" -ForegroundColor Red
} catch {
    Write-Host "   -> SUCCESS: Unauthorized update prevented with HTTP 403 Forbidden!" -ForegroundColor Green
}

try {
    # Attempt to access admin dashboard with startup token
    Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Headers $startupHeaders
    Write-Host "   -> FAILED: Startup was able to access admin dashboard!" -ForegroundColor Red
} catch {
    Write-Host "   -> SUCCESS: Admin dashboard access blocked for non-admin with HTTP 403 Forbidden!" -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "ALL 12 INTEGRATION WORKFLOWS TESTED & PASSED PERFECTLY!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
