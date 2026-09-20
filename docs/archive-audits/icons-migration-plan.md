# Solar Icon Replacement Strategy for Bina Project Studio

## Overview
Replacing Lucide React icons with @iconify-json/solar via Astro Icon for better performance

## Icon Mapping Table
Lucide → Solar Equivalent (via @iconify-json/solar)

| Lucide Name | Solar Icon ID (for use in <Icon.Solar /> or custom import) |
|-------------|-----------------------------------------------------------|
| Star | solar-star-full-duotone |
| ChevronLeft | solar-arrow-left-line-duotone |
| ChevronRight | solar-arrow-right-line-duotone |
| CheckCircle2 | solar-check-circle-duotone |
| Quote | solar-message-text-bubble-bold-duotone |
| Save | solar-save-line-duotone |
| ArrowLeft | solar-arrow-left-line-duotone |
| Globe | solar-globe-square-broken |
| AlertCircle | solar-info-circle-bold-duotone |
| RefreshCw | solar-refresh-ccw-bold-duotone |
| Rocket | solar-rocket-send-line-bold-duotone |
| Send | solar-paper-plane-linear |
| Upload | solar-upload-bold-duotone |
| X / Close | solar-x-bold-duotone |
| Images | solar-images-photo-broken |
| CheckCircle | solar-check-circle-bold-duotone |
| GitBranch | solar-git-fork-bold-duotone |
| Sparkles | solar-stars-star-broken-bold-duotone |
| Settings | solar-settings-cog-square-bold-duotone |
| Lock | solar-lock-minimalistic-bold-duotone |
| Mail | solar-mail-open-read-linear |
| ArrowRight | solar-arrow-right-line-duotone |
| Shield | solar-shield-check-broken-bold-duotone |
| Smartphone | solar-mobile-phone-linear |
| Monitor | solar-desktop-computer-linear |
| AlertTriangle | solar-warning-square-bold-duotone |
| Plus | solar-plus-bold-duotone |
| Search | solar-search-normal-bold-duotone |
| Shuffle | solar-randomize-alt-bold-duotone |
| Trash2 | solar-trash-bin-delete-bold-duotone |
| Info | solar-info-bold-duotone |
| HelpCircle | solar-help-bookmark-bold-duotone |
| LogOut | solar-sign-out-alt-bold-duotone |
| Menu | solar-menu-burger-linear |
| ExternalLink | solar-up-right-square-linear |
| Edit3 | solar-edit-square-line-duotone |
| Eye | solar-eye-bold-duotone |
| User | solar-user-rounded-bold-duotone |
| LogIn | solar-sign-in-alt-bold-duotone |
| Bell | solar-notification-linear |
| Home | solar-home-housing-bold-duotone |
| BookOpen | solar-books-line-duotone |

## Installation Status
✅ @iconify-json/solar already installed
✅ astro-icon updated

## Next Steps
1. Replace all lucide-react imports in dashboard files (15+ files)
2. Replace all lucide-react usage in main site (1 file)
3. Test build & verify icons render correctly
