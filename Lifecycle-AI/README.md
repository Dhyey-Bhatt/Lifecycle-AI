# 🛡️ Lifecycle AI — Smart Family Vault, Warranty & Senior Care Platform
### Complete User Guide & End-to-End Workflow Manual

Welcome to **Lifecycle AI** — your all-in-one smart household platform. Lifecycle AI simplifies household management by organizing receipts and warranties, predicting hardware failure risks, drafting legal dispute claims, estimating resale values, powering a dedicated Senior Citizen Health Hub, and providing a ChatGPT-like AI assistant tailored to your role.

---

## 📑 Table of Contents

1. [Understanding User Roles & Personas](#1-understanding-user-roles--personas)
2. [User Workflows](#2-user-workflows)
   - [Workflow 1: Scanning & Uploading Receipts](#workflow-1-scanning--uploading-receipts)
   - [Workflow 2: Tracking Document & Warranty Lifecycles](#workflow-2-tracking-document--warranty-lifecycles)
   - [Workflow 3: Using the AI Chat Assistant (`/chat`)](#workflow-3-using-the-ai-chat-assistant-chat)
   - [Workflow 4: Senior Citizen Health & Wellness Hub (`/senior-health`)](#workflow-4-senior-citizen-health--wellness-hub-senior-health)
   - [Workflow 5: AI Hardware Failure Risk Predictor (`/risk-prediction`)](#workflow-5-ai-hardware-failure-risk-predictor-risk-prediction)
   - [Workflow 6: AI Legal Claim & Dispute Generator (`/claim-generator`)](#workflow-6-ai-legal-claim--dispute-generator-claim-generator)
   - [Workflow 7: Extended Warranty Cost-Benefit Advisor (`/advisor`)](#workflow-7-extended-warranty-cost-benefit-advisor-advisor)
   - [Workflow 8: Product Resale Valuation Estimator (`/resale-estimator`)](#workflow-8-product-resale-valuation-estimator-resale-estimator)
   - [Workflow 9: Managing Family Vault Members (`/family-vault`)](#workflow-9-managing-family-vault-members-family-vault)
   - [Workflow 10: AI Training Studio & Dataset Pipeline (`/ai-training`)](#workflow-10-ai-training-studio--dataset-pipeline-ai-training)
   - [Workflow 11: Pastel Theme & Color Customizer](#workflow-11-pastel-theme--color-customizer)
3. [Permission & Access Matrix](#3-permission--access-matrix)
4. [Getting Started & Local Setup](#4-getting-started--local-setup)

---

## 1. Understanding User Roles & Personas

Lifecycle AI features **Multi-Persona Role-Based Access Control (RBAC)**. The platform adapts its features, navigation, and AI assistant behavior based on who is logged in:

```
                             ┌────────────────────────┐
                             │    Lifecycle Portal    │
                             │        /login          │
                             └───────────┬────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
    ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
    │       ADMIN       │      │     HOUSEHELP     │      │  SENIOR CITIZEN   │
    │  (Master Control) │      │  (Home Care & AI) │      │ (Wellness & Care) │
    └─────────┬─────────┘      └─────────┬─────────┘      └─────────┬─────────┘
              │                          │                          │
    • Scan & Upload Receipts   • Appliance Inventory      • Health Vitals Telemetry
    • AI Claim Generator       • Appliance AI Assistant   • Medication Checklist
    • AI Risk Prediction       • View Warranty Expiries   • AI Health Precautions
    • Cost-Benefit Advisor     • Cleaning & Manual Lookup • Emergency SOS Hotline
    • Resale Estimator         • (Prices/Claims Hidden)   • Product Safety Guides
    • AI Model Retraining                                 
    • Manage Family Vault                                 
```

### How to Switch Roles in the App
- In the top right corner of the navigation bar, click on your **User Profile / Persona badge**.
- Select **"Switch Persona"** and choose between **Admin**, **Househelp**, or **Senior Citizen**.
- You can also log out and log in via `/login` with single-click demo accounts.

---

## 2. User Workflows

---

### Workflow 1: Scanning & Uploading Receipts
*Role: Admin*

1. Click the **"+ Upload Document"** button in the sidebar or top navigation bar.
2. Drag and drop your receipt or invoice image (JPEG, PNG, PDF) into the upload dropzone.
3. The **AI Multi-Modal OCR Scanner** analyzes the document:
   - Auto-extracts: **Product Name**, **Brand**, **Model Number**, **Serial Number**, **Invoice Number**, **Purchase Date**, **Purchase Price**, **Warranty Period**, and **Extended Warranty**.
4. Review the extracted fields in the live preview.
5. Choose an assigned family member and click **"Save to Family Vault"**.
6. The asset is immediately registered, status calculated, and added to the AI knowledge base.

---

### Workflow 2: Tracking Document & Warranty Lifecycles
*Roles: Admin (Full Edit/Delete), Househelp (View-Only), Senior Citizen (View-Only)*

1. Navigate to **"Documents"** (`/documents`) from the sidebar.
2. **Filter by Status**:
   - 🟢 **Valid**: Active warranty protection.
   - 🟡 **Expiring Soon**: Less than 45 days remaining (recommended to review extended warranty or prepare claims).
   - 🔴 **Expired**: Coverage has lapsed.
   - 🔵 **In Claim**: Active dispute or RMA in progress.
3. **Filter by Category**: Laptops & Computers, Smartphones & Tablets, Home Appliances, Audio & Wearables.
4. **Search**: Search by product name, model number, serial number, invoice reference, or retailer.
5. Click on any document card to view detailed specifications, warranty certificates, and claim history.

---

### Workflow 3: Using the AI Chat Assistant (`/chat`)
*Roles: All Roles (Persona-Tailored & Server-Enforced)*

The AI Chat system at `/chat` provides a production-grade ChatGPT-like experience powered by an AI Gateway:

1. **Start a Conversation**:
   - Click **"+ New Chat"** in the chat sidebar.
   - Type your question in natural language (e.g. *"When does the warranty for my MacBook expire?"*).
   - Press `Enter` to send, or `Shift + Enter` for a new line.
2. **Role-Specific AI Behavior**:
   - 👑 **Admin (`LifecycleBot`)**: Has full access. Answers questions about serial numbers, expiry dates, claim strategies, repair vs. buy cost-benefit, and senior wellness summaries.
   - 🧹 **Househelp (`HomeCare AI`)**: Focuses on appliance operations, step-by-step cleaning guides, error codes, and maintenance schedules. Financial purchase prices and private family records are strictly hidden.
   - 👴 **Senior Citizen (`SeniorCare AI`)**: Uses warm, patient language to assist with daily medication reminders, blood pressure advice, and safe kitchen appliance operation. Includes safety disclaimers and emergency advice.
3. **Interactive Features**:
   - **Markdown & Code Blocks**: Cleanly formatted bullet points, bold keywords, and syntax-highlighted code with a **"Copy Code"** button.
   - **Copy Response**: Click **"Copy"** below any bot message.
   - **Feedback Rating**: Click **👍 (Thumbs Up)** or **👎 (Thumbs Down)** on responses to help improve AI accuracy.
   - **Rename & Delete**: Rename chat titles or delete conversations from the chat sidebar.
   - **Search Conversations**: Find past chat sessions using the sidebar search box.

---

### Workflow 4: Senior Citizen Health & Wellness Hub (`/senior-health`)
*Roles: Senior Citizen, Admin*

1. Navigate to **"Senior Health"** (`/senior-health`).
2. **Log Daily Vitals**:
   - Enter **Systolic / Diastolic Blood Pressure** (e.g., `120/80`), **Blood Glucose** (mg/dL), and **Resting Heart Rate** (BPM).
   - Click **"Save Vitals Entry"** to record telemetry and calculate health standing.
3. **Track Daily Medications**:
   - View your prescribed medication schedule (Morning, Lunch, Afternoon, Evening).
   - Check off medications as you take them (e.g., *Atorvastatin*, *Metformin XR*, *Vitamin D3*).
4. **AI Health Precautions Engine**:
   - View personalized lifestyle precautions generated from your vitals (hydration goals, low-impact walking routines, joint mobility tips).
5. **Emergency SOS Trigger**:
   - Click the **"🚨 EMERGENCY SOS"** button to simulate immediate caregiver dispatch and primary physician notifications.

---

### Workflow 5: AI Hardware Failure Risk Predictor (`/risk-prediction`)
*Role: Admin*

1. Navigate to **"Risk Prediction"** (`/risk-prediction`).
2. Select any registered asset (e.g. *MacBook Pro*, *Samsung Refrigerator*, *LG OLED TV*).
3. The AI engine evaluates component degradation based on **45,000+ consumer hardware repair reports**:
   - View **Overall Health Score** (0-100) and **Risk Status** (*Optimal*, *Moderate Watch*, *High Alert*).
   - Inspect individual failure mode probabilities (e.g., Inverter Compressor, Display Flex Cable, USB-C Port).
   - Read community insights and preventive maintenance tips before warranty lapse.

---

### Workflow 6: AI Legal Claim & Dispute Generator (`/claim-generator`)
*Role: Admin*

1. Navigate to **"Claim Generator"** (`/claim-generator`).
2. Select the broken device and describe the manifested hardware fault.
3. Choose the desired legal template:
   - 🏛️ **Formal Consumer Grievance & Legal Notice**: Statutory notice citing Consumer Protection regulations for uncooperative brands.
   - ✉️ **Urgent Service Escalation Email**: High-priority escalation message to service center managers.
   - 📋 **Official Warranty & Insurance Claim Letter**: Standard policy lodgement for extended warranty underwriters.
   - 🛠️ **Technical Service Request Ticket**: Formal repair ticket requesting on-site technician dispatch.
4. Click **"Generate AI Claim Document"**.
5. Copy the generated legal notice or export it as a text file for immediate dispatch.

---

### Workflow 7: Extended Warranty Cost-Benefit Advisor (`/advisor`)
*Role: Admin*

1. Navigate to **"Warranty Advisor"** (`/advisor`).
2. Enter the device purchase price, extended warranty cost, extended coverage duration, and planned ownership years.
3. The actuarial engine calculates:
   - Empirical failure probability in years 2–5.
   - Average out-of-pocket repair costs.
   - **Net Expected Value (NEV)** in dollars.
4. Review the verdict: **"STRONGLY RECOMMENDED TO BUY"**, **"SKIP & SELF-INSURE"**, or **"BORDERLINE DECISION"** with clear financial rationale.

---

### Workflow 8: Product Resale Valuation Estimator (`/resale-estimator`)
*Role: Admin*

1. Navigate to **"Resale Estimator"** (`/resale-estimator`).
2. Select an asset and its physical condition (*Mint with Box*, *Good*, *Fair*, *Poor*).
3. View current secondary market valuations benchmarked across **eBay**, **Swappa**, **Local Marketplace**, and **Manufacturer Trade-In**.
4. Inspect the **18-Month Valuation Projection Chart** to identify the optimal **60-day selling window** before product depreciation accelerates.

---

### Workflow 9: Managing Family Vault Members (`/family-vault`)
*Role: Admin*

1. Navigate to **"Family Vault"** (`/family-vault`).
2. View all active family members and their assigned device counts.
3. Click **"+ Add Family Member"** to invite a new user.
4. Assign access roles:
   - **Admin (Owner)**: Full master control.
   - **Editor**: Can upload documents, edit extracted details, and generate claims.
   - **Viewer**: Read-only access to view invoices and ask the AI assistant.

---

### Workflow 10: AI Training Studio & Dataset Pipeline (`/ai-training`)
*Role: Admin*

1. Navigate to **"AI Training Studio"** (`/ai-training`).
2. Review user-verified OCR extraction samples in the ground-truth pipeline.
3. Select training hyperparameters (Epochs, Learning Rate, Model Architecture).
4. Click **"Trigger Fine-Tuning Job"** to simulate model weight updates.
5. Click **"Export Dataset (.JSONL)"** to download formatted datasets for fine-tuning open-source LLMs or custom Vision-NER models.

---

### Workflow 11: Pastel Theme & Color Customizer
*Roles: All Roles*

1. Click the **Palette / Theme icon** in the top navigation bar.
2. Select from curated pastel aesthetic themes:
   - 💜 **Royal Violet (Default)**
   - 🩵 **Ocean Breeze**
   - 💚 **Emerald Mint**
   - 🧡 **Sunset Peach**
   - 🩷 **Rose Gold**
3. Choose your preferred corner border radius and typography scale.
4. Preferences are saved automatically to `localStorage` and persist across sessions.

---

## 3. Permission & Access Matrix

| Feature / Module | Route Path | Admin | Househelp | Senior Citizen | Unauthorized Access Behavior |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Main Dashboard** | `/` | ✅ | ✅ | ✅ | Accessible to all |
| **Documents Catalog** | `/documents` | Full (Add/Edit/Delete) | View-Only | View-Only | Accessible (Role-tailored) |
| **AI Chat Assistant** | `/chat` | Full Access | Home Maintenance | Health & Safety | Accessible (Role-tailored) |
| **Senior Health Hub** | `/senior-health` | ✅ | ❌ | ✅ | 🚫 Blocked by `<ProtectedRoute />` |
| **Family Vault** | `/family-vault` | Full Manage | ❌ | View Members | 🚫 Blocked by `<ProtectedRoute />` |
| **Risk Prediction** | `/risk-prediction` | ✅ | ❌ | ❌ | 🚫 Blocked by `<ProtectedRoute />` |
| **Claim Generator** | `/claim-generator` | ✅ | ❌ | ❌ | 🚫 Blocked by `<ProtectedRoute />` |
| **Warranty Advisor** | `/advisor` | ✅ | ❌ | ❌ | 🚫 Blocked by `<ProtectedRoute />` |
| **Resale Estimator** | `/resale-estimator` | ✅ | ❌ | ❌ | 🚫 Blocked by `<ProtectedRoute />` |
| **AI Training Studio** | `/ai-training` | ✅ | ❌ | ❌ | 🚫 Blocked by `<ProtectedRoute />` |

---

## 4. Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 1. Configure Backend Environment
In `backend/.env`:
```env
PORT=5000
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Configure Frontend Environment
In `.env` (project root):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start the Application
```bash
# Terminal 1: Start Backend (Runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Runs on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser to start using **Lifecycle AI**!
