-- ==========================================
-- VENDOR BRIDGE ERP - FULL SQL SCHEMA SETUP
-- ==========================================
-- Copy and run this script in the Supabase SQL Editor:

-- 1. Profiles Table (Update constraint for new roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  role TEXT CHECK (role IN ('procurement_officer', 'vendor', 'manager_approver', 'admin')) NOT NULL DEFAULT 'procurement_officer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Vendors Table
CREATE TABLE IF NOT EXISTS public.vendors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_details TEXT,
  gst_details TEXT,
  category TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to vendors" ON public.vendors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write to vendors for procurement/admin" ON public.vendors FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('procurement_officer', 'admin')
  )
);

-- 3. RFQs Table
CREATE TABLE IF NOT EXISTS public.rfqs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  product_details TEXT,
  quantity INTEGER NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'completed', 'closed')) DEFAULT 'active',
  assigned_vendors JSONB, -- JSON array of vendor IDs
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to rfqs" ON public.rfqs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow officers to create rfqs" ON public.rfqs FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('procurement_officer', 'admin')
  )
);

-- 4. Quotations Table
CREATE TABLE IF NOT EXISTS public.quotations (
  id BIGSERIAL PRIMARY KEY,
  rfq_id BIGINT REFERENCES public.rfqs(id) ON DELETE CASCADE,
  vendor_id BIGINT REFERENCES public.vendors(id) ON DELETE SET NULL,
  vendor_name TEXT NOT NULL,
  pricing_details NUMERIC NOT NULL,
  delivery_timeline INTEGER NOT NULL, -- Delivery timeline in days
  notes TEXT,
  status TEXT CHECK (status IN ('submitted', 'selected', 'approved', 'rejected')) DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to quotations" ON public.quotations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow vendors to manage their own quotations" ON public.quotations FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.vendors
    WHERE vendors.id = quotations.vendor_id AND vendors.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('procurement_officer', 'manager_approver', 'admin')
  )
);

-- 5. Procurement Approvals Table
CREATE TABLE IF NOT EXISTS public.procurement_approvals (
  id BIGSERIAL PRIMARY KEY,
  rfq_id BIGINT REFERENCES public.rfqs(id) ON DELETE CASCADE,
  quotation_id BIGINT REFERENCES public.quotations(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.procurement_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to approvals" ON public.procurement_approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow managers to update approvals" ON public.procurement_approvals FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('manager_approver', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'procurement_officer'
  )
);

-- 6. Purchase Orders Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id BIGSERIAL PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  rfq_id BIGINT REFERENCES public.rfqs(id) ON DELETE SET NULL,
  quotation_id BIGINT REFERENCES public.quotations(id) ON DELETE SET NULL,
  vendor_id BIGINT REFERENCES public.vendors(id) ON DELETE SET NULL,
  subtotal NUMERIC NOT NULL,
  tax_rate NUMERIC DEFAULT 18.0,
  tax_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('issued', 'acknowledged', 'closed')) DEFAULT 'issued',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to POs" ON public.purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow officers to create POs" ON public.purchase_orders FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('procurement_officer', 'admin')
  )
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id BIGSERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  po_id BIGINT REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow officers to manage invoices" ON public.invoices FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('procurement_officer', 'admin')
  )
);

-- 8. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read to logs" ON public.activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow system insert to logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- ==========================================
-- 9. LIFECYCLE AI CHAT & MODEL TRAINING DATA
-- ==========================================

-- 9.1 Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  persona TEXT CHECK (persona IN ('ADMIN', 'HOUSEHELP', 'SENIOR')) NOT NULL DEFAULT 'ADMIN',
  provider TEXT NOT NULL DEFAULT 'openai',
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON public.conversations 
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 9.2 Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages(conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON public.messages 
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 9.3 Chat Feedback Table (For Training Dataset Curation & Model Evaluation)
CREATE TABLE IF NOT EXISTS public.chat_feedback (
  id TEXT PRIMARY KEY,
  message_id TEXT REFERENCES public.messages(id) ON DELETE CASCADE,
  conversation_id TEXT REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating TEXT CHECK (rating IN ('positive', 'negative')) NOT NULL,
  feedback_text TEXT,
  model TEXT,
  provider TEXT,
  training_eligible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert feedback" ON public.chat_feedback 
  FOR ALL TO authenticated USING (auth.uid() = user_id);

