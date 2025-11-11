# OpenAI API Configuration for Dollar City Chatbot

## Quick Setup

To enable the AI chatbot, you need to configure your OpenAI API key.

### Option 1: Using Regular OpenAI (Recommended)

1. **Get your API key** from https://platform.openai.com/api-keys

2. **Update the backend `.env` file:**
   ```bash
   cd apps/api
   ```

3. **Edit `.env` and replace the Azure settings with:**
   ```env
   # Remove or comment out Azure settings
   # AZURE_OPENAI_API_KEY="your-api-key-here"
   # AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
   
   # Add OpenAI settings
   OPENAI_API_KEY="sk-your-actual-api-key-here"
   ```

4. **Restart the API server:**
   ```bash
   pnpm dev
   ```

### Option 2: Using Azure OpenAI

If you have an Azure OpenAI account:

1. Update `apps/api/.env`:
   ```env
   AZURE_OPENAI_API_KEY="your-azure-key"
   AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
   AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o-mini"
   AZURE_OPENAI_API_VERSION="2024-02-15-preview"
   ```

2. Restart the API server

## Testing the Chatbot

1. Navigate to any job page: http://localhost:3001
2. Click the **"Chat"** button in the top-right
3. Try these example questions:
   - "Who are the top 3 candidates for this role?"
   - "Show me candidates with Customer Service skills"
   - "What are the must-have skills for this job?"
   - "Compare the top 2 candidates"

## Troubleshooting

### Chatbot says "API not configured"
- Check that your API key is correctly set in `apps/api/.env`
- Restart the API server after changing `.env`
- Verify the key starts with `sk-` for OpenAI

### No response from chatbot
- Open browser console (F12) to check for errors
- Check API server logs for error messages
- Verify the API server is running on port 4000

### Rate limit errors
- You may be using a free OpenAI tier with limits
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

## Current Implementation

The chatbot can:
- ✅ Answer questions about candidates
- ✅ Provide job requirement information
- ✅ Compare candidates
- ✅ Filter and search candidates
- ✅ Explain fit scores

The chatbot uses OpenAI function calling to intelligently query your recruitment database.

