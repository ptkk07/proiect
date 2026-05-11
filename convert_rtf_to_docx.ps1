$src = 'C:\Users\Acsai Patrick\Documents\proiect\Proiect_NutriFit_Tracker.doc.rtf'
$dest = 'C:\Users\Acsai Patrick\Documents\proiect\Proiect_NutriFit_Tracker.docx'
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($src)
    $doc.SaveAs($dest, 16)
    $doc.Close()
    $word.Quit()
    Write-Output "OK: Saved to $dest"
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($word -ne $null) { try { $word.Quit() } catch {} }
    exit 1
}