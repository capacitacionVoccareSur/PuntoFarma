$p = 'C:\Users\Edward Morales\Documents\Proyectos\Punto farma\dump_prog.txt'
$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)

# Show the c-prog card area (index ~22189 → line context)
$lines = $c -split "`n"
Write-Host "Total lines: $($lines.Count)"

# Find lines with prog-card
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'prog-card|m-prog|Comparaci') {
        Write-Host "L$($i+1): $($lines[$i])"
    }
}
