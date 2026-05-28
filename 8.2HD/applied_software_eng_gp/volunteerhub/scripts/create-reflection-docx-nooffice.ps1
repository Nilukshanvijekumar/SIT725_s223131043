$ErrorActionPreference = "Stop"

$inputPath = Join-Path (Get-Location) "REFLECTION.md"
$outputPath = Join-Path (Get-Location) "SIT725-8.2HD-Reflection.docx"
$tmpRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("docx-build-" + [System.Guid]::NewGuid().ToString("N"))
$workDir = Join-Path $tmpRoot "docx"

if (-not (Test-Path $inputPath)) {
  throw "Input file not found: $inputPath"
}

New-Item -ItemType Directory -Path $workDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $workDir "_rels") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $workDir "word") -Force | Out-Null

function Escape-Xml([string]$s) {
  if ($null -eq $s) { return "" }
  $s = $s -replace "&", "&amp;"
  $s = $s -replace "<", "&lt;"
  $s = $s -replace ">", "&gt;"
  $s = $s -replace '"', "&quot;"
  return $s
}

$md = Get-Content -Path $inputPath -Raw
$lines = $md -split "`r?`n"

$paragraphs = New-Object System.Collections.Generic.List[string]
foreach ($line in $lines) {
  if ($line -match "^##\s+") {
    $title = Escape-Xml ($line -replace "^##\s+", "")
    $paragraphs.Add("<w:p><w:r><w:rPr><w:b/><w:sz w:val='32'/></w:rPr><w:t xml:space='preserve'>$title</w:t></w:r></w:p>")
    continue
  }
  if ($line -match "^\-\s+") {
    $item = Escape-Xml ($line -replace "^\-\s+", "")
    $paragraphs.Add("<w:p><w:r><w:t xml:space='preserve'>- $item</w:t></w:r></w:p>")
    continue
  }
  $plain = Escape-Xml $line
  if ([string]::IsNullOrWhiteSpace($plain)) {
    $paragraphs.Add("<w:p/>")
  } else {
    $paragraphs.Add("<w:p><w:r><w:t xml:space='preserve'>$plain</w:t></w:r></w:p>")
  }
}

$contentTypes = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
"@

$rels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"@

$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 wp14">
  <w:body>
    $($paragraphs -join "`n    ")
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
      <w:cols w:space="708"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$contentTypesPath = Join-Path $workDir "[Content_Types].xml"
$relsPath = Join-Path $workDir "_rels/.rels"
$docXmlPath = Join-Path $workDir "word/document.xml"

$contentTypes | Out-File -LiteralPath $contentTypesPath -Encoding utf8
$rels | Out-File -LiteralPath $relsPath -Encoding utf8
$documentXml | Out-File -LiteralPath $docXmlPath -Encoding utf8

$zipPath = Join-Path $tmpRoot "reflection.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $outputPath) { Remove-Item $outputPath -Force }

Compress-Archive -Path (Join-Path $workDir "*") -DestinationPath $zipPath -Force
Move-Item -Path $zipPath -Destination $outputPath -Force

Remove-Item -Path $tmpRoot -Recurse -Force
Write-Output "Created $outputPath"
