/**
 * Lifecycle-AI Centralized API Service Layer
 * 
 * - Derives API Base URL dynamically from Vite environment variable: `VITE_API_BASE_URL`
 * - Fallbacks safely to 'http://localhost:5000' (or relative proxy if empty)
 * - Exposes single unified `api` object for all frontend features
 * - Exposes `apiRequest`, `fetchWithAuth`, `API_BASE_URL`, and `getApiUrl`
 */

// Dynamically derive base URL from environment variable
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = (rawBaseUrl !== undefined && rawBaseUrl !== null && rawBaseUrl !== '')
  ? rawBaseUrl.replace(/\/+$/, '')
  : 'http://localhost:5000';

/**
 * Constructs a dynamic full API URL from an endpoint or relative path
 * @param {string} endpoint - e.g. '/api/metrics' or 'api/documents'
 * @returns {string} full URL
 */
export const getApiUrl = (endpoint = '') => {
  if (!endpoint) return API_BASE_URL;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Centralized HTTP request client
 * Handles base URL prefixing, JSON serialization, headers, and authentication tokens
 */
export async function apiRequest(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(url, config);

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = (data && typeof data === 'object' && (data.error || data.message))
      ? (data.error || data.message)
      : `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    error.response = response;
    throw error;
  }

  return data;
}

// Alias for legacy pages
export const fetchWithAuth = apiRequest;

/**
 * Unified API Client with all endpoint groups
 */
export const api = {
  baseUrl: API_BASE_URL,
  getUrl: getApiUrl,
  request: apiRequest,

  // 1. Health & Dashboard Metrics
  metrics: {
    get: () => apiRequest('/api/metrics'),
    health: () => apiRequest('/api/health')
  },

  // 2. Documents & Lifecycle CRUD
  documents: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'All') {
          searchParams.append(key, val);
        }
      });
      const queryString = searchParams.toString();
      return apiRequest(`/api/documents${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiRequest(`/api/documents/${id}`),
    create: (payload) => apiRequest('/api/documents', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    update: (id, payload) => apiRequest(`/api/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
    delete: (id) => apiRequest(`/api/documents/${id}`, {
      method: 'DELETE'
    })
  },

  // 3. AI Intelligence Modules
  ai: {
    // Multi-modal heuristic OCR & NER Extraction
    extract: (payload) => apiRequest('/api/ai/extract', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    // Predictive Risk Modeling
    predictRisk: (payload) => apiRequest('/api/ai/predict-risk', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    // AI Claim & Legal Dispute Generator
    claimGenerator: (payload) => apiRequest('/api/ai/claim-generator', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    // Extended Warranty Cost-Benefit Advisor
    costBenefit: (payload) => apiRequest('/api/ai/cost-benefit', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    // Asset Resale Valuation & Deprecation
    resaleEstimate: (payload) => apiRequest('/api/ai/resale-estimate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    // Interactive Lifecycle Assistant Chatbot
    chat: (payload) => apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    // AI Training Studio & Dataset Pipeline
    training: {
      getDataset: () => apiRequest('/api/ai/training/dataset'),
      train: (payload) => apiRequest('/api/ai/training/train', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
      getExportUrl: (format = 'jsonl') => getApiUrl(`/api/ai/training/export?format=${format}`)
    }
  },

  // 4. Senior Citizen Health & Wellness Hub
  senior: {
    getHealth: () => apiRequest('/api/senior/health'),
    logVitals: (payload) => apiRequest('/api/senior/health', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getMedications: () => apiRequest('/api/senior/medications'),
    getPrecautions: (payload) => apiRequest('/api/senior/ai-precautions', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },

  // 5. Family Vault & Permissions
  vault: {
    getMembers: () => apiRequest('/api/vault/members'),
    createMember: (payload) => apiRequest('/api/vault/members', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },

  // 5. Auth & User Management
  auth: {
    forgotPassword: (email) => apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },
  users: {
    getAll: () => apiRequest('/api/users'),
    updateRole: (userId, role) => apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    })
  },

  // 6. Procurement & Vendor System
  vendors: {
    getAll: () => apiRequest('/api/vendors'),
    create: (payload) => apiRequest('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    updateStatus: (id, status) => apiRequest(`/api/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  },
  rfqs: {
    getAll: () => apiRequest('/api/rfqs'),
    create: (payload) => apiRequest('/api/rfqs', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getQuotations: (rfqId) => apiRequest(`/api/rfqs/${rfqId}/quotations`)
  },
  quotations: {
    getAll: () => apiRequest('/api/quotations'),
    create: (payload) => apiRequest('/api/quotations', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },
  purchaseOrders: {
    getAll: () => apiRequest('/api/purchase-orders'),
    create: (payload) => apiRequest('/api/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },
  invoices: {
    getAll: () => apiRequest('/api/invoices'),
    create: (payload) => apiRequest('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    sendEmail: (id) => apiRequest(`/api/invoices/${id}/email`, {
      method: 'POST'
    }),
    update: (id, payload) => apiRequest(`/api/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
  },
  approvals: {
    getAll: () => apiRequest('/api/approvals'),
    create: (payload) => apiRequest('/api/approvals', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    update: (id, payload) => apiRequest(`/api/approvals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
  },
  requests: {
    getAll: () => apiRequest('/api/requests'),
    create: (payload) => apiRequest('/api/requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },
  logs: {
    getAll: () => apiRequest('/api/logs')
  }
};

export default api;
