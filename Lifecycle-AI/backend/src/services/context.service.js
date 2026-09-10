import { sampleDocuments, familyVaultMembers } from '../../data/seedData.js';
import PersonaService from './persona.service.js';

/**
 * ContextService
 * 
 * Securely retrieves and formats application data context for the AI Gateway.
 * Enforces role-based data filtering so unauthorized information (e.g. prices to househelp)
 * is never injected into the LLM context window.
 */
export class ContextService {
  /**
   * Helper to retrieve active documents (from in-memory or database)
   */
  static getDocuments() {
    return sampleDocuments;
  }

  /**
   * Helper to retrieve senior vitals and medications
   */
  static getSeniorData() {
    return {
      profile: {
        name: "Robert Vance",
        age: 72,
        bloodGroup: "O+",
        primaryCaregiver: "Dhyey Bhatt (+1 555-019-2834)",
        physician: "Dr. Sarah Evans, MD"
      },
      currentVitals: {
        bloodPressure: "122/78",
        bpStatus: "Optimal",
        glucose: 104,
        heartRate: 72,
        spo2: 98,
        notes: "Morning walk completed, feeling energized"
      },
      medications: [
        { id: 1, name: 'Atorvastatin (Lipitor)', dose: '20mg', time: '8:00 AM', purpose: 'Cholesterol & Heart', taken: true },
        { id: 2, name: 'Metformin XR', dose: '500mg', time: '1:00 PM', purpose: 'Glucose Regulation', taken: true },
        { id: 3, name: 'Vitamin D3 & Calcium', dose: '1000 IU', time: '2:30 PM', purpose: 'Bone & Joint Strength', taken: false },
        { id: 4, name: 'CoQ10 Complex', dose: '100mg', time: '8:30 PM', purpose: 'Cardiovascular Support', taken: false }
      ]
    };
  }

  /**
   * Calculates status for a document
   */
  static calculateStatus(doc) {
    if (doc.status === 'Archived' || doc.status === 'In Claim' || doc.status === 'Renewed') {
      return doc.status;
    }
    const today = new Date();
    const expiryDate = new Date(doc.warrantyExpiryDate);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays <= 45) return 'Expiring Soon';
    return 'Valid';
  }

  /**
   * Builds the context string for the AI prompt based on user role and query
   * @param {Object} user - Authenticated user
   * @param {string} [query=''] - Current user query
   * @returns {string} Formatted text context
   */
  static buildContextForUser(user, query = '') {
    const roleKey = PersonaService.resolvePersonaKey(user?.role);
    const allDocs = this.getDocuments();

    if (roleKey === 'HOUSEHELP') {
      // Filter out financials, prices, payment methods, personal invoices
      const applianceDocs = allDocs.filter(d => 
        ['Home Appliances', 'Laptops & Computers', 'Smartphones & Tablets', 'Audio & Wearables'].includes(d.category)
      );

      const items = applianceDocs.map(d => {
        // Sanitize any dollar signs or currency amounts from notes
        const sanitizedNotes = (d.notes || 'Standard operation')
          .replace(/\$[\d,]+(\.\d{2})?/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        return `
- ASSET: ${d.productName}
  Brand: ${d.brand}
  Model: ${d.modelNumber}
  Category: ${d.category}
  Warranty Status: ${this.calculateStatus(d)} (Expires: ${d.warrantyExpiryDate || 'N/A'})
  Notes & Operating Specs: ${sanitizedNotes}`;
      }).join('\n');

      return `REGISTERED HOUSEHOLD APPLIANCES & OPERATING SPECS (NO FINANCIAL DATA):
${items}`;
    }

    if (roleKey === 'SENIOR') {
      const seniorData = this.getSeniorData();
      const meds = seniorData.medications.map(m => `  * ${m.name} (${m.dose}) at ${m.time} - Purpose: ${m.purpose} [Status: ${m.taken ? 'Taken' : 'Scheduled'}]`).join('\n');

      const applianceSummary = allDocs.map(d => `  * ${d.productName} (${d.brand}) - Category: ${d.category}`).join('\n');

      return `SENIOR HEALTH TELEMETRY & HOUSEHOLD SUMMARY:
Profile: ${seniorData.profile.name}, Age: ${seniorData.profile.age}, Caregiver: ${seniorData.profile.primaryCaregiver}
Latest Vitals: Blood Pressure: ${seniorData.currentVitals.bloodPressure} (${seniorData.currentVitals.bpStatus}), Heart Rate: ${seniorData.currentVitals.heartRate} bpm, Glucose: ${seniorData.currentVitals.glucose} mg/dL, SpO2: ${seniorData.currentVitals.spo2}%

Daily Medication Schedule:
${meds}

Household Appliances in Home:
${applianceSummary}`;
    }

    // ADMIN: Full context
    const fullDocs = allDocs.map(d => `
- ASSET ID: ${d.id}
  Product: ${d.productName}
  Brand: ${d.brand} | Model: ${d.modelNumber} | Serial: ${d.serialNumber}
  Category: ${d.category}
  Purchase Date: ${d.purchaseDate} | Price: $${d.purchasePrice} (${d.paymentMethod || 'Card'})
  Retailer: ${d.retailer || 'N/A'} | Invoice: ${d.invoiceNumber || 'N/A'}
  Warranty: ${d.warrantyType} (${d.warrantyPeriodMonths} months)
  Warranty Expiry: ${d.warrantyExpiryDate} [Status: ${this.calculateStatus(d)}]
  Extended Warranty: ${d.extendedWarranty?.provider || 'None'} (Status: ${d.extendedWarranty?.status || 'N/A'})
  Assigned Member: ${d.assignedTo || 'Family'}
  Notes: ${d.notes || 'None'}`).join('\n');

    const members = familyVaultMembers.map(m => `  * ${m.name} (${m.role}) - ${m.email}`).join('\n');

    return `COMPLETE REGISTERED VAULT ASSETS:
${fullDocs}

FAMILY VAULT MEMBERS:
${members}`;
  }

  // ==========================================
  // REAL BACKEND TOOLS (For Tool Calling)
  // ==========================================

  static async getUserAppliances(user) {
    const docs = this.getDocuments();
    const isHousehelp = PersonaService.resolvePersonaKey(user?.role) === 'HOUSEHELP';
    return docs.map(d => ({
      id: d.id,
      productName: d.productName,
      brand: d.brand,
      modelNumber: d.modelNumber,
      category: d.category,
      status: this.calculateStatus(d),
      expiryDate: d.warrantyExpiryDate,
      ...(isHousehelp ? {} : { purchasePrice: d.purchasePrice, purchaseDate: d.purchaseDate, serialNumber: d.serialNumber })
    }));
  }

  static async getApplianceDetails(user, identifier) {
    const idLower = String(identifier).toLowerCase();
    const doc = this.getDocuments().find(d => 
      d.id.toLowerCase() === idLower ||
      d.productName.toLowerCase().includes(idLower) ||
      d.modelNumber.toLowerCase().includes(idLower) ||
      d.serialNumber.toLowerCase().includes(idLower)
    );

    if (!doc) return null;

    const isHousehelp = PersonaService.resolvePersonaKey(user?.role) === 'HOUSEHELP';
    if (isHousehelp) {
      return {
        productName: doc.productName,
        brand: doc.brand,
        modelNumber: doc.modelNumber,
        category: doc.category,
        notes: doc.notes,
        warrantyStatus: this.calculateStatus(doc),
        warrantyExpiry: doc.warrantyExpiryDate
      };
    }

    return {
      ...doc,
      status: this.calculateStatus(doc)
    };
  }

  static async getExpiringWarranties(user) {
    const docs = this.getDocuments();
    return docs
      .map(d => ({ ...d, status: this.calculateStatus(d) }))
      .filter(d => d.status === 'Expiring Soon' || d.status === 'Expired');
  }
}

export default ContextService;
