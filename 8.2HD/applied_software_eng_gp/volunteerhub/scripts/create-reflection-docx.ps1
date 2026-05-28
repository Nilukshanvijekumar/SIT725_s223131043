$ErrorActionPreference = "Stop"

$inputPath = Join-Path (Get-Location) "REFLECTION.md"
$outputPath = Join-Path (Get-Location) "SIT725-8.2HD-Reflection.docx"

if (-not (Test-Path $inputPath)) {
  throw "Input file not found: $inputPath"
}

$text = Get-Content -Path $inputPath -Raw
$lines = $text -split "`r?`n"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

foreach ($line in $lines) {
  $p = $doc.Paragraphs.Add()
  if ($line -match "^##\s+") {
    $p.Range.Text = ($line -replace "^##\s+", "")
    $p.Range.Font.Bold = 1
    $p.Range.Font.Size = 16
  } elseif ($line -match "^\-\s+") {
    $p.Range.Text = ([char]8226).ToString() + " " + ($line -replace "^\-\s+", "")
    $p.Range.Font.Bold = 0
    $p.Range.Font.Size = 11
  } else {
    $p.Range.Text = $line
    $p.Range.Font.Bold = 0
    $p.Range.Font.Size = 11
  }
  $p.Range.InsertParagraphAfter() | Out-Null
}

# 16 = wdFormatDocumentDefault (.docx)
$doc.SaveAs($outputPath, 16)
$doc.Close()
$word.Quit()

[void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc)
[void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word)

Write-Output "Created $outputPath"
