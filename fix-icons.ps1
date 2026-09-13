# Script to replace all Lucide React icons with Solar Icons via astro-icon

\ = Get-ChildItem -Path 'D:\binaproject' -Recurse -Include '*.tsx','*.ts','*.astro' -Exclude 'node_modules','dist','.astro'
\ = @{
    'Star' = 'solar-star-broken';
    'ChevronLeft' = 'solar-arrow-left-line-duotone';
    'ChevronRight' = 'solar-arrow-right-line-duotone';
    'CheckCircle2' = 'solar-check-circle-duotone';
    'Quote' = 'solar-message-text-bubble-bold-duotone';
    'Save' = 'solar-save-line-duotone';
    'ArrowLeft' = 'solar-arrow-left-line-duotone';
    'Globe' = 'solar-globe-square-broken';
    'AlertCircle' = 'solar-info-circle-bold-duotone';
    'RefreshCw' = 'solar-refresh-ccw-bold-duotone';
    'Rocket' = 'solar-rocket-send-line-bold-duotone';
    'Send' = 'solar-paper-plane-linear';
    'Upload' = 'solar-upload-bold-duotone';
    'X' = 'solar-x-bold-duotone';
    'Images' = 'solar-images-photo-broken';
    'CheckCircle' = 'solar-check-circle-bold-duotone';
    'GitBranch' = 'solar-git-fork-bold-duotone';
    'Sparkles' = 'solar-stars-star-broken-bold-duotone';
    'Settings' = 'solar-settings-cog-square-bold-duotone';
    'Lock' = 'solar-lock-minimalistic-bold-duotone';
    'Mail' = 'solar-mail-open-read-linear';
    'ArrowRight' = 'solar-arrow-right-line-duotone';
    'Shield' = 'solar-shield-check-broken-bold-duotone';
    'Smartphone' = 'solar-mobile-phone-linear';
    'Monitor' = 'solar-desktop-computer-linear';
    'AlertTriangle' = 'solar-warning-square-bold-duotone';
    'Plus' = 'solar-plus-bold-duotone';
    'Search' = 'solar-search-normal-bold-duotone';
    'Shuffle' = 'solar-randomize-alt-bold-duotone';
    'Trash2' = 'solar-trash-bin-delete-bold-duotone';
    'Info' = 'solar-info-bold-duotone';
    'HelpCircle' = 'solar-help-bookmark-bold-duotone';
    'LogOut' = 'solar-sign-out-alt-bold-duotone';
    'Menu' = 'solar-menu-burger-linear';
    'X' = 'solar-x-bold-duotone';
    'ExternalLink' = 'solar-up-right-square-linear';
    'Edit3' = 'solar-edit-square-line-duotone';
    'Eye' = 'solar-eye-bold-duotone';
    'User' = 'solar-user-rounded-bold-duotone';
    'Star' = 'solar-star-full-bold-duotone';
}

foreach (\ in \) {
    \ = Get-Content \.FullName -Raw
    \ = \
    
    # Remove lucide-react import
    \ = \ -replace 'from\s+[\"'']lucide-react[\"''];?\$', ''
    
    foreach (\ in \.Keys) {
        \ = "\\b\\\\b(?![-a-zA-Z])"
        \ = \[\]
        \ = \ -replace \, \
    }
    
    Set-Content \.FullName \
}
