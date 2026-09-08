import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export let supabase = null;
export let isMock = false;

// Mock database in-memory storage for fallback mode
const mockDb = {
  users: [
    { id: 'officer-uuid', email: 'officer@vendorbridge.com', username: 'officer', role: 'procurement_officer' },
    { id: 'vendor-uuid-1', email: 'vendor1@vendorbridge.com', username: 'vendor1', role: 'vendor' },
    { id: 'vendor-uuid-2', email: 'vendor2@vendorbridge.com', username: 'vendor2', role: 'vendor' },
    { id: 'manager-uuid', email: 'manager@vendorbridge.com', username: 'manager', role: 'manager_approver' },
    { id: 'admin-uuid', email: 'admin@vendorbridge.com', username: 'admin', role: 'admin' }
  ],
  vendors: [
    { id: 1, name: 'Acme Procurement Solutions', email: 'vendor1@vendorbridge.com', contact_details: 'John Acme, +91 9876543210', gst_details: '07AAAAA1111A1Z1', category: 'IT & Hardware', status: 'active', user_id: 'vendor-uuid-1', created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString() },
    { id: 2, name: 'Global Tech Suppliers', email: 'vendor2@vendorbridge.com', contact_details: 'Sarah Global, +91 9988776655', gst_details: '08BBBBB2222B2Z2', category: 'Software Licensing', status: 'active', user_id: 'vendor-uuid-2', created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString() }
  ],
  rfqs: [
    { id: 1, title: 'Server Upgrade Procurement', description: 'Request for high-performance database servers for the new warehouse cluster.', product_details: '3x Rack Servers, 64GB RAM, 2TB NVMe SSD', quantity: 3, deadline: new Date(Date.now() + 3600000 * 24 * 5).toISOString(), status: 'active', assigned_vendors: [1, 2], created_by: 'officer-uuid', created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString() }
  ],
  quotations: [
    { id: 1, rfq_id: 1, vendor_id: 1, vendor_name: 'Acme Procurement Solutions', pricing_details: 150000, delivery_timeline: 10, notes: 'Includes 3 years warranty and free shipping.', status: 'submitted', created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
    { id: 2, rfq_id: 1, vendor_id: 2, vendor_name: 'Global Tech Suppliers', pricing_details: 142000, delivery_timeline: 15, notes: 'Prompt delivery, warranty optional (+10%).', status: 'submitted', created_at: new Date(Date.now() - 3600000 * 8).toISOString() }
  ],
  procurement_approvals: [],
  purchase_orders: [],
  invoices: [],
  activity_logs: [
    { id: 1, user_id: 'officer-uuid', username: 'officer', action: 'CREATE_RFQ', details: 'Created RFQ: Server Upgrade Procurement', created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString() }
  ]
};

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url') {
  try {
    console.log('Testing connection to Supabase endpoint...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const reachable = await fetch(supabaseUrl, { signal: controller.signal })
      .then(() => true)
      .catch(() => false);
    clearTimeout(timeoutId);

    if (reachable) {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('⚡ Connected successfully to Supabase Client!');
    } else {
      console.error('❌ Supabase endpoint is unreachable (connection timeout).');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
  }
}

if (!supabase) {
  isMock = true;
  console.warn('\n⚠️  WARNING: Supabase URL and Key not found in .env!');
  console.warn('⚠️  Running in LOCAL MOCK DATABASE MODE.');
  console.warn('⚠️  Check backend/.env file to configure real Supabase connection.\n');

  // Build a minimal mock client to emulate Supabase's javascript client
  supabase = {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        const username = email.split('@')[0];
        const match = mockDb.users.find(u => u.username === username && username === password);
        
        if (match) {
          return {
            data: {
              user: { id: match.id, email: match.email },
              session: { access_token: `mock-token-${match.id}` }
            },
            error: null
          };
        }
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials (use officer/officer, vendor1/vendor1, manager/manager, admin/admin)' }
        };
      },
      signUp: async ({ email, password, options }) => {
        const username = email.split('@')[0];
        const exists = mockDb.users.some(u => u.email === email || u.username === username);
        if (exists) {
          return { data: { user: null }, error: { message: 'User already exists' } };
        }
        
        const role = options?.data?.role || 'procurement_officer';
        const newUser = {
          id: `uuid-${Math.random().toString(36).substr(2, 9)}`,
          email,
          username,
          role
        };
        mockDb.users.push(newUser);
        
        // If registering a vendor, automatically seed a vendor record
        if (role === 'vendor') {
          const newVendor = {
            id: mockDb.vendors.length + 1,
            name: `${username.toUpperCase()} Corp`,
            email,
            contact_details: 'Auto generated contact',
            gst_details: '07GSTPENDING1234',
            category: 'General Solutions',
            status: 'active',
            user_id: newUser.id,
            created_at: new Date().toISOString()
          };
          mockDb.vendors.push(newVendor);
        }

        return {
          data: { user: { id: newUser.id, email: newUser.email } },
          error: null
        };
      },
      getUser: async (token) => {
        const userId = token.replace('mock-token-', '');
        const match = mockDb.users.find(u => u.id === userId);
        if (match) {
          return { data: { user: { id: match.id, email: match.email } }, error: null };
        }
        return { data: { user: null }, error: { message: 'Invalid session' } };
      }
    },
    from: (table) => {
      return {
        select: (columns = '*') => {
          let currentData = [];
          if (mockDb[table]) {
            currentData = JSON.parse(JSON.stringify(mockDb[table]));
          } else if (table === 'profiles') {
            currentData = JSON.parse(JSON.stringify(mockDb.users));
          }

          const builder = {
            eq: (field, value) => {
              currentData = currentData.filter(item => item[field] === value);
              return builder;
            },
            in: (field, arrayValues) => {
              currentData = currentData.filter(item => arrayValues.includes(item[field]));
              return builder;
            },
            order: (field, { ascending = true } = {}) => {
              currentData.sort((a, b) => {
                if (a[field] < b[field]) return ascending ? -1 : 1;
                if (a[field] > b[field]) return ascending ? 1 : -1;
                return 0;
              });
              return builder;
            },
            limit: (count) => {
              currentData = currentData.slice(0, count);
              return builder;
            },
            then: (resolve) => {
              resolve({ data: currentData, error: null });
            }
          };
          return builder;
        },
        insert: (rows) => {
          const arr = Array.isArray(rows) ? rows : [rows];
          let tableArray = mockDb[table];
          if (table === 'profiles') tableArray = mockDb.users;
          
          if (!tableArray) {
            return Promise.resolve({ data: [], error: { message: `Table ${table} not mocked` } });
          }

          const inserted = arr.map(row => {
            const newRow = {
              id: tableArray.length + 1,
              created_at: new Date().toISOString(),
              ...row
            };
            tableArray.push(newRow);
            return newRow;
          });
          return Promise.resolve({ data: inserted, error: null });
        },
        update: (updates) => {
          return {
            eq: (field, value) => {
              let updatedData = [];
              let tableArray = mockDb[table];
              if (table === 'profiles') tableArray = mockDb.users;
              
              if (tableArray) {
                tableArray.forEach((item, index) => {
                  if (item[field] === value) {
                    const newItem = { ...item, ...updates };
                    tableArray[index] = newItem;
                    updatedData.push(newItem);
                  }
                });
              }
              return Promise.resolve({ data: updatedData, error: null });
            }
          };
        }
      };
    }
  };
}
