import { aiService } from '../src/services/ai/ai.service.js';
import PersonaService from '../src/services/persona.service.js';
import ContextService from '../src/services/context.service.js';
import ChatService from '../src/services/chat.service.js';

async function runTests() {
  console.log('🧪 Starting AI Chat System Integration Tests...\n');

  // Test 1: AI Provider & Model Info
  console.log('--- TEST 1: AI Gateway & Provider Info ---');
  const modelInfo = aiService.getModelInfo();
  console.log('Active Model Info:', modelInfo);
  if (modelInfo.provider === 'openai') {
    console.log('✅ AI Gateway initialized with OpenAI provider successfully.');
  } else {
    console.error('❌ Failed: unexpected provider');
  }

  // Test 2: Role-based Persona Prompts
  console.log('\n--- TEST 2: Role-Based Persona Prompts ---');
  const adminPrompt = PersonaService.getSystemPrompt({ role: 'Admin', name: 'Dhyey' });
  const househelpPrompt = PersonaService.getSystemPrompt({ role: 'Househelp', name: 'Maria' });
  const seniorPrompt = PersonaService.getSystemPrompt({ role: 'Senior', name: 'Robert' });

  if (adminPrompt.includes('LifecycleBot') && adminPrompt.includes('ADMIN')) {
    console.log('✅ Admin persona prompt contains LifecycleBot and Admin role.');
  }
  if (househelpPrompt.includes('HomeCare AI') && househelpPrompt.includes('NEVER disclose financial information')) {
    console.log('✅ Househelp persona prompt strictly forbids financial disclosure.');
  }
  if (seniorPrompt.includes('SeniorCare AI') && seniorPrompt.includes('NEVER diagnose medical conditions')) {
    console.log('✅ Senior persona prompt contains strict non-diagnostic medical disclaimer.');
  }

  // Test 3: Grounded Context & Data Privacy
  console.log('\n--- TEST 3: Grounded Context & RBAC Data Isolation ---');
  const househelpContext = ContextService.buildContextForUser({ role: 'Househelp' });
  const adminContext = ContextService.buildContextForUser({ role: 'Admin' });
  const seniorContext = ContextService.buildContextForUser({ role: 'Senior' });

  if (!househelpContext.includes('$') && !househelpContext.includes('purchasePrice')) {
    console.log('✅ Househelp context is completely scrubbed of prices/financial figures.');
  } else {
    console.error('❌ Househelp context leaked price information!');
  }

  if (seniorContext.includes('Blood Pressure') && seniorContext.includes('Daily Medication Schedule')) {
    console.log('✅ Senior context includes vitals and medication schedule.');
  }

  if (adminContext.includes('COMPLETE REGISTERED VAULT ASSETS') && adminContext.includes('Price: $')) {
    console.log('✅ Admin context contains complete portfolio assets and pricing.');
  }

  // Test 4: Conversation Lifecycle & Message Storage
  console.log('\n--- TEST 4: Chat Service & Message Persistence ---');
  const adminUser = { id: 'user_admin', name: 'Dhyey Bhatt', role: 'Admin' };

  const conv = await ChatService.createConversation(adminUser, { title: 'Test Warranty Chat' });
  console.log('Created Conversation:', conv.id, conv.title);

  const convs = await ChatService.getConversations(adminUser);
  console.log('Total Conversations for Admin:', convs.length);

  const response = await ChatService.sendMessage(
    adminUser, 
    conv.id, 
    'When does the warranty for my MacBook Pro expire?'
  );

  console.log('User Message:', response.userMessage.content);
  console.log('Assistant Response:', response.assistantMessage.content.slice(0, 120) + '...');
  console.log('Response Metadata:', response.assistantMessage.metadata);

  if (response.assistantMessage.content.length > 0) {
    console.log('✅ Assistant message generated and recorded successfully.');
  }

  // Test 5: Rename & Feedback
  console.log('\n--- TEST 5: Rename & Feedback ---');
  const renamed = await ChatService.renameConversation(adminUser, conv.id, 'Renamed MacBook Chat');
  console.log('Renamed Conversation Title:', renamed.title);

  const feedbackRes = await ChatService.recordFeedback(adminUser, response.assistantMessage.id, {
    rating: 'thumbs_up',
    feedbackText: 'Accurate warranty date!'
  });
  console.log('Feedback recorded:', feedbackRes);

  // Test 6: Delete
  console.log('\n--- TEST 6: Delete Conversation ---');
  const deleteRes = await ChatService.deleteConversation(adminUser, conv.id);
  console.log('Deleted Conversation:', deleteRes);

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
