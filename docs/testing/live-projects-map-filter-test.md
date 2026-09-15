# Live Projects Map - Filter Category Test Guide

## 🎯 **Testing Checklist**

### **Visual Changes:**

#### **BEFORE (Old Categories):**
```
Filter Pills Order:
1. Semua Proyek
2. Konstruksi Baru
3. Renovasi ❌
4. Interior
```

#### **AFTER (New Categories):**
```
Filter Pills Order:
1. Semua Proyek ✅
2. Interior ✅
3. Konstruksi Baru ✅
4. Desain ✅ (NEW)
```

---

## 🧪 **Test Cases**

### **Test Case 1: Filter "Semua Proyek"**
- ✅ Expected: Show all projects regardless of category
- ✅ Verify count shows total number of active projects

### **Test Case 2: Filter "Interior"**
- ✅ Expected: Show only projects with category 'Interior' or contains 'Interior'
- ✅ Popup should display "Interior" label
- ✅ English version: Display "Interior"

### **Test Case 3: Filter "Konstruksi"**
- ✅ Expected: Show only projects with category 'Konstruksi'
- ✅ Popup should display "Konstruksi Baru" in Indonesian
- ✅ English version: Display "New Construction"

### **Test Case 4: Filter "Desain" (NEW)**
- ✅ Expected: Show only projects with category 'Desain'
- ✅ Popup should display "Desain" label
- ✅ English version: Display "Design"

---

## 🌐 **Language Switching Tests**

### **Indonesian Mode:**
| Category ID | Display Text |
|------------|--------------|
| `all` | Semua Proyek |
| `interior` | Interior |
| `konstruksi` | Konstruksi Baru |
| `desain` | Desain |

### **English Mode:**
| Category ID | Display Text |
|------------|--------------|
| `all` | All Projects |
| `interior` | Interior |
| `konstruksi` | New Construction |
| `desain` | Design |

---

## 📊 **Expected Sample Data After Migration**

### **Projects That Should Appear:**

#### **Category: Desain**
1. **"Konsep Arsitektur Villa Tropis Modern"**
   - Area: Kedungkandang, Kota Malang
   - Progress: 75%
   - Status: Active

2. **"Masterplan Kawasan Perumahan Eco-Green"**
   - Area: Singosari, Kabupaten Malang
   - Progress: 60%
   - Status: Active

3. **"Rancang Bangun Interior Coffee Shop Industrial"**
   - Area: Lowokwaru, Kota Malang
   - Progress: 85%
   - Status: Active

#### **Category: Interior**
- Existing interior projects should still show

#### **Category: Konstruksi**
- Existing construction projects should still show

#### **Category: Renovasi** ⚠️ **Removed from Filter**
- Will only appear under "Semua Proyek"
- Cannot be filtered independently anymore

---

## 🛠️ **How to Run Tests**

### **Step 1: Start Development Server**
```bash
cd D:\binaproject\apps\web
npm run dev
```

### **Step 2: Navigate to Live Projects Map**
- Go to: `http://localhost:5173/#live-projects`
- Or check homepage if map is embedded there

### **Step 3: Test Each Filter Button**
1. Click "Semua Proyek" → Count = Total projects
2. Click "Interior" → Count = Interior projects only
3. Click "Konstruksi" → Count = Construction projects only
4. Click "Desain" → Count = Design projects (NEW!)

### **Step 4: Test Language Switcher**
- Switch to English mode
- Verify all category labels change correctly
- Click filters again to ensure mapping works

### **Step 5: Test Popup Details**
- Click on any project pin
- Verify category label displays correctly
- Check both Indonesian and English versions

---

## ⚠️ **Known Issues & Edge Cases**

### **Issue 1: Existing 'Renovasi' Projects**
- **Impact**: These won't show when clicking filter buttons individually
- **Solution**: They only appear under "Semua Proyek"
- **Migration**: Optional - can re-categorize later

### **Issue 2: Category Name Variations**
- **Example**: `'Interior Design'` vs `'Interior'`
- **Handling**: Our code now checks `includes('Interior')` for flexibility
- **Recommendation**: Standardize database values to one canonical name

### **Issue 3: No Matching Results**
- **Scenario**: User clicks "Desain" but no projects exist yet
- **Expected Behavior**: Show empty state with appropriate message
- **Current Implementation**: Shows map with no markers

---

## 📝 **Files Changed**

### **Primary Files Modified:**
1. ✅ `src/components/LiveProjectsMap.tsx`
   - Line ~221-226: Updated `categories` array
   - Line ~171-173: Updated `localizedCategory` mapping logic

### **New Files Created:**
1. ✅ `supabase/migrations/20260914_add_desain_category.sql`
   - Adds sample "Desain" category projects
   - Provides optional data migration scripts

---

## ✅ **Success Criteria**

All tests pass if:
- [ ] Filter order is: SemProyek → Interior → Konstruksi → Desain
- [ ] "Renovasi" button is completely removed
- [ ] New "Desain" filter works and shows correct projects
- [ ] English translations are accurate
- [ ] Category labels in popups match current language
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile
- [ ] Popup rendering doesn't break

---

## 🔍 **Browser Console Checks**

Expected output when testing:
```
[LiveProjectsMap] Successfully loaded X projects
Map initialized at center [-7.95, 112.63], zoom 10
Rendered X markers for selected filter
Categories updated successfully
```

If you see any errors, please report them!

---

## 📸 **Screenshots Needed**

After testing, please capture:
1. Full map view with all filters visible
2. Close-up of each filter pill when active
3. Popup preview for each category type
4. Mobile responsive view (if possible)
5. Language switch demonstration

---

**Ready to test? Let me know the results!** 🚀
