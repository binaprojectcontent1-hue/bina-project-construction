# Replace ALL files systematically

\ = @(
    'src\pages\index.astro',
    'src\components\sections\ProcessSection.astro',
    'src\components\WhyChooseUsSection.astro',
    'src\components\TestimonialSection.astro'
)

\ = Get-ChildItem -Path 'apps\dashboard\src' -Recurse -Include '*.tsx','*.ts' | Where-Object { \.FullName -notmatch 'node_modules|dist' }

foreach (\ in \) {
    Write-Host "Processing: \"
    
    # Read content
    \ = Get-Content \.FullName -Raw
    
    # Add astro-icon import if lucide doesn't exist
    if (\ -match 'lucide-react') {
        Write-Host "  - Contains lucide-react, replacing..." -ForegroundColor Yellow
        
        # Remove lucide import line
        \ = \ -replace "^import\s+\{[^}]+\}\s+from\s+['\"]lucide-react['\"];\?\r?\n", "" -replace "\r?^import\s+{\s+.*lucide.*}\s+from\s+['\"][^\]'\"]+['\"];?\r?\n", ""
        
        # Common replacements (manual mapping)
        \ = @{
            'Star' = '@iconify-json/solar-star-full-duotone';
            'ChevronLeft' = '@iconify-json/solar-arrow-left-linear';
            'CheckCircle2' = '@iconify-json/solar-check-circle-duotone';
        }
        
        foreach (\ in \.Keys) {
            \ = "[\"']\[\"']"
            \ = \[\]
            \ = \ -replace \, \
        }
    }
    
    Set-Content \.FullName \ -Encoding UTF8
}
