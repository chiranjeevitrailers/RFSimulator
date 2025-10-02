# 🎯 5GLabX Sidebar - Visual Navigation Guide

## ✅ All Components ARE in the Frontend!

The sidebar sections are **collapsible** with chevron arrows (▶/▼). They start **EXPANDED** by default.

---

## 📍 Where to Find Each Section:

### **Navigation Path:**
```
http://localhost:3000/user-dashboard
  → Click "5GLabX Platform" tab
  → Look at LEFT SIDEBAR
  → Scroll down to see all sections
```

---

## 📋 **Complete Sidebar Structure (Top to Bottom):**

```
┌─────────────────────────────────┐
│         5GLabX                  │
├─────────────────────────────────┤
│                                 │
│ MAIN VIEWS                      │
│ ├── Dashboard                   │
│ ├── Logs Viewer                 │
│ ├── Layer Trace                 │
│ └── Call Flow                   │
│                                 │
│ ANALYTICS                       │
│ ├── Analytics [LIVE]            │
│ ├── Protocol Layer Test [NEW]   │
│ ├── Data Flow Debugger [DEBUG]  │
│ ├── Test Data Generator [GEN]   │
│ └── Integration Tester [TEST]   │
│                                 │
│ ENHANCED VIEWS                  │
│ ├── Advanced Logs [ADVANCED]    │
│ └── Enhanced PHY [ENHANCED]     │
│                                 │
│ ▼ O-RAN ANALYSIS                │ ← Click chevron to collapse/expand
│ ├── O-RAN Overview              │
│ ├── O-RAN Interfaces            │
│ ├── O-RAN CU Analysis           │
│ ├── O-RAN DU Analysis           │
│ ├── O-RAN E1 Interface          │
│ ├── O-RAN F1 Interface          │
│ ├── O-RAN Performance           │
│ ├── O-RAN xApps                 │
│ └── O-RAN SMO                   │
│                                 │
│ ▼ NB-IOT ANALYSIS               │
│ ├── NB-IoT Overview             │
│ ├── NB-IoT Call Flow            │
│ ├── NB-IoT Analytics            │
│ ├── NB-IoT PHY Layer            │
│ ├── NB-IoT MAC Layer            │
│ ├── NB-IoT RRC Layer            │
│ └── NB-IoT Testing              │
│                                 │
│ ▼ C-V2X ANALYSIS                │
│ ├── V2X Overview                │
│ ├── V2X Sidelink                │
│ ├── V2X Analytics               │
│ ├── V2X PHY Layer               │
│ ├── V2X MAC Layer               │
│ ├── V2X Testing                 │
│ └── V2X Scenarios               │
│                                 │
│ ▼ NTN ANALYSIS                  │
│ ├── NTN Overview                │
│ ├── Satellite Links             │
│ ├── NTN Analytics [LIVE]        │
│ ├── SIB19 Analysis              │
│ ├── Timing & Delay              │
│ ├── Doppler Analysis            │
│ └── NTN Scenarios               │
│                                 │
│ PROTOCOL LAYERS                 │
│ ├── PHY Layer                   │
│ ├── MAC Layer                   │
│ ├── RLC Layer                   │
│ ├── PDCP Layer                  │
│ ├── RRC Layer                   │
│ ├── NAS Layer                   │
│ └── IMS Layer                   │
│                                 │
│ CORE NETWORK                    │
│ ├── AMF Analyzer                │
│ ├── SMF Analyzer                │
│ ├── UPF Analyzer                │
│ ├── AUSF Analyzer               │
│ ├── UDM Analyzer                │
│ └── Config Manager              │
│                                 │
│ 4G LEGACY                       │
│ ├── MME Analyzer                │
│ ├── SGW Analyzer                │
│ └── PGW Analyzer                │
│                                 │
│ UTILITIES                       │
│ ├── Report Generator            │
│ ├── Export Manager              │
│ └── Help & Support              │
│                                 │
│ TEST SUITES                     │
│ └── Test Suites                 │
│                                 │
└─────────────────────────────────┘
```

---

## 🔍 **Why You Might Not See Them:**

### **Possible Reasons:**

1. **Sections are collapsed** - Click the chevron (▶) to expand
2. **Need to scroll** - Sidebar is scrollable, scroll down
3. **Wrong tab** - Make sure you're in "5GLabX Platform" tab, not "Test Manager"
4. **Code not pulled** - Run `git pull origin main` to get latest

---

## ✅ **Verification Steps:**

### **Step 1: Pull Latest Code**
```bash
cd /workspace
git pull origin main
```

### **Step 2: Restart Server**
```bash
npm run dev
```

### **Step 3: Open in Browser**
```
http://localhost:3000/user-dashboard
```

### **Step 4: Navigate to 5GLabX Platform**
- Click **"5GLabX Platform"** tab (NOT "Test Manager")
- This is important - Test Manager has different sidebar

### **Step 5: Check Sidebar**
- Look at LEFT sidebar
- Should see sections listed above
- **Scroll down** if needed
- Click chevron (▶) if section is collapsed

---

## 📸 **What It Should Look Like:**

```
┌─────────────────────┐
│      5GLabX         │  ← Logo at top
├─────────────────────┤
│ MAIN VIEWS          │  ← Section header
│ ├ Dashboard         │  ← Clickable items
│ ├ Logs Viewer       │
│ ├ Layer Trace       │
│ └ Call Flow         │
├─────────────────────┤
│ ANALYTICS           │
│ ├ Analytics [LIVE]  │
│ ...                 │
├─────────────────────┤
│ ▼ O-RAN ANALYSIS    │  ← Expandable section
│ ├ O-RAN Overview    │  ← Click to view
│ ├ Interfaces        │
│ ...                 │
└─────────────────────┘
```

---

## 🚨 **If Still Not Visible:**

### **Debug Checklist:**

1. **Check browser console (F12):**
   - Any JavaScript errors?
   - Component loading errors?

2. **Verify you're on correct page:**
   - URL should be: `/user-dashboard`
   - Tab should say: "5GLabX Platform"

3. **Check sidebar width:**
   - Sidebar should be 256px (w-64) wide
   - Visible on left side

4. **Try different browser:**
   - Clear cache (Ctrl+Shift+R)
   - Try incognito mode

---

## 💡 **Quick Test:**

Open browser console (F12) and run:

```javascript
// Check if sections exist
document.querySelectorAll('nav .mb-6').length
// Should return: 13 (number of sections)

// Check if O-RAN items exist
document.querySelectorAll('nav button').length
// Should return: 61+ (all menu items)
```

If these return the right numbers, the components ARE there - you just need to find them!

---

## 🎯 **Screenshot Location for Reference:**

If you can share a screenshot of your sidebar, I can tell you exactly where to look!

Or tell me:
1. Are you on `/user-dashboard` page? ✅/❌
2. Did you click "5GLabX Platform" tab? ✅/❌
3. Do you see a left sidebar? ✅/❌
4. What sections do you see in sidebar? (list them)

I'll help you locate the missing items! 🚀