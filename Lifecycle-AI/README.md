# 🛡️ Lifecycle AI — Smart Family Vault, Warranty & Senior Care Platform

An intelligent, multi-persona household management platform that automates document & warranty lifecycles, delivers AI predictive hardware failure analytics, generates legal consumer dispute claims, and powers a dedicated **Senior Citizen Health & Wellness Hub**.

---

## 🌟 Key Highlights & Architecture

- 🚀 **Vite + React 18**: Ultra-fast frontend with interactive pastel theme customizer.
- 🔐 **Multi-Persona Role-Based Access Control (RBAC)**: Distinct permissions and tailored UI workflows for **Admin**, **Househelp**, and **Senior Citizen**.
- 🛡️ **Strict URL Security**: `<ProtectedRoute />` layer preventing unauthorized access even when navigating directly via URL.
- 🌐 **Centralized Dynamic API Layer**: Single-file API architecture (`src/api/index.js`) with dynamic base URL derived from `.env` (`VITE_API_BASE_URL`).
- 🤖 **AI Intelligence Suite**:
  - **Vision & NER Extraction**: Multi-modal OCR extracting serials, dates, warranties & prices.
  - **Risk Prediction Engine**: Telemetry-grounded failure curves across 45,000+ consumer reports.
  - **AI Claim & Legal Dispute Generator**: Produces formal grievance notices, RMA escalations, and insurance letters.
  - **Extended Warranty Advisor**: Actuarial cost-benefit calculator.
  - **Asset Resale Estimator**: Secondary market depreciation curves.
  - **AI Training Studio**: Fine-tunes custom Vision-NER models and exports `.jsonl` datasets.
  - **Senior Health Precautions Engine**: Biometric telemetry analysis & daily wellness guidelines.

---

## 👥 User-Wise Workflows & Personas

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
   • Resale Estimator         • (Protected from Admin)   • Product Safety Guides
   • AI Model Retraining                                 
   • Manage Family Vault                                 
```

---

### 1. 👑 Administrator Persona (`Dhyey Bhatt`)
> **Role Goal:** Master control of household assets, financial analytics, family member permissions, and legal warranty enforcement.

#### Workflow:
1. **Document Upload & AI Scan**: Upload receipts/invoices &rarr; AI Vision OCR automatically parses Brand, Model, Serial, Purchase Date, and Warranty expiry.
2. **Warranty Lifecycle Monitoring**: Tracks documents across `Valid`, `Expiring Soon`, `Expired`, `Renewed`, and `In Claim` statuses.
3. **AI Risk Prediction**: Evaluates component failure risk curves before manufacturer warranty expires.
4. **AI Claim Generator**: Produces ready-to-dispatch zero-deductible legal dispute notices and RMA service tickets.
5. **Cost-Benefit Advisor**: Calculates actuarial expected value ($) of buying extended warranty protection vs. self-insuring.
6. **Resale Value Estimator**: Forecasts depreciation trajectories and determines the optimal 60-day selling window.
7. **AI Training Studio**: Inspects user-verified ground truth data and triggers custom model fine-tuning with JSONL export.
8. **Senior Health Oversight**: Monitors health telemetry and caregiver assignments for family elders.

---

### 2. 🧹 Househelp Persona (`Maria Santos`)
> **Role Goal:** Smooth home maintenance, appliance operation lookup, and scheduled service tracking without access to sensitive financial records or administrative tools.

#### Workflow:
1. **Appliance & Equipment Inventory**: Accesses the view-only appliance catalog to verify equipment models and warranty coverage.
2. **AI HomeCare Assistant**:
   - Asks maintenance questions (e.g. *"How do I clean the Samsung refrigerator coils?"*, *"How to descale the espresso machine?"*).
   - Looks up step-by-step cleaning procedures, filter replacement schedules, and operating manuals.
3. **Service Alert Verification**: Checks when appliances are due for routine maintenance before breakdowns occur.
4. **Restricted Security Access**: Sensitive financial modules (claims, ML studio, member management) are automatically hidden and blocked.

---

### 3. 👴 Senior Citizen Persona (`Robert Vance`)
> **Role Goal:** Simplified household device safety alongside a personalized, dedicated Health & Wellness Hub for daily vitals, medication adherence, and proactive health advice.

#### Workflow:
1. **Senior Health & Wellness Hub (`/senior-health`)**:
   - **Daily Vitals Telemetry**: Logs and monitors Blood Pressure (Systolic/Diastolic), Blood Glucose, Resting BPM, and SpO2.
   - **Prescription Schedule Tracker**: Interactive checklist for Morning, Lunch, Afternoon, and Evening medications with progress tracking.
   - **AI Senior Health Precautions Engine**: Context-aware lifestyle advice (hydration alerts, gentle walking routines, ambient temperature controls, joint mobility).
2. **Emergency SOS & Caregiver Directory**: One-touch SOS trigger with simulated emergency dispatch to primary caregiver (*Dhyey Bhatt*) and family doctor.
3. **Appliance Safety Assistance**: Consults **SeniorCare AI** for operating microwave, TV, or kitchen appliances with safety precautions.

---

## 🔒 Permission & Security Matrix

| Feature / Route | Route Path | Admin | Househelp | Senior Citizen | Direct URL Access if Unauthorized |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Main Dashboard** | `/` | ✅ | ✅ | ✅ | Allowed |
| **All Documents / Appliances** | `/documents` | Full (Add/Delete) | View-Only | View-Only | Allowed (Role-tailored view) |
| **AI Chat Assistant** | `/chat` | Full Access | Home Maintenance | Health & Safety | Allowed (Role-tailored persona) |
| **Senior Health Hub** | `/senior-health` | ✅ | ❌ | ✅ | 🚫 **Blocked with Security Screen** |
| **Family Vault** | `/family-vault` | Full Manage | ❌ | View Members | 🚫 **Blocked with Security Screen** |
| **AI Risk Prediction** | `/risk-prediction` | ✅ | ❌ | ❌ | 🚫 **Blocked with Security Screen** |
| **AI Claim Generator** | `/claim-generator` | ✅ | ❌ | ❌ | 🚫 **Blocked with Security Screen** |
| **Cost-Benefit Advisor** | `/advisor` | ✅ | ❌ | ❌ | 🚫 **Blocked with Security Screen** |
| **Resale Estimator** | `/resale-estimator` | ✅ | ❌ | ❌ | 🚫 **Blocked with Security Screen** |
| **AI Training Studio** | `/ai-training` | ✅ | ❌ | ❌ | 🚫 **Blocked with Security Screen** |

---

## ⚙️ Environment Configuration & Centralized API

All API calls flow through the single module [`src/api/index.js`](file:///c:/dhyey_projects/New_project/Lifecycle-AI/src/api/index.js).

### 1. Configure `.env`
Create a `.env` file in the project root:
```env
# Point to your backend server URL
VITE_API_BASE_URL=http://localhost:5000
```
> To point to staging or production, simply modify `VITE_API_BASE_URL` in `.env` without modifying any frontend source files.

### 2. Using the API Module in Code
```javascript
import { api } from './api';

// Metrics & Health
const metrics = await api.metrics.get();

// Document Operations
const docs = await api.documents.getAll({ category: 'Laptops & Computers' });
const newDoc = await api.documents.create(formData);

// AI Intelligence
const scanResult = await api.ai.extract({ rawText: 'simulated_ocr' });
const riskProfile = await api.ai.predictRisk({ productName: 'MacBook Pro', currentAgeMonths: 14 });

// Senior Health & Wellness
const healthData = await api.senior.getHealth();
await api.senior.logVitals({ bpSys: 120, bpDia: 80, glucose: 100, heartRate: 72 });
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Run Backend Server
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Run Frontend Application
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🎨 Interactive Testing & Demo Guide

1. Open `http://localhost:5173/login` in your browser.
2. Click **"Enter as Admin"**, **"Enter as Househelp"**, or **"Enter as Senior"** on the interactive persona cards.
3. Switch personas on the fly at any time using the **Profile Menu in the top Navigation Bar**.
4. Test URL security by logging in as **Househelp** and manually navigating to `/senior-health` or `/ai-training` to see the **Access Restricted** security screen.
5. Open the **Pastel Theme Engine** in the sidebar to customize primary, surface, and accent color tokens.
