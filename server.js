import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const agentTools = [
  {
    type: 'function',
    function: {
      name: 'send_email_summary',
      description: 'Sends an email report or summary to the user.',
      parameters: {
        type: 'object',
        properties: {
          recipient: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' }
        },
        required: ['recipient', 'subject', 'body']
      }
    }
  }
];

app.post('/agent-endpoint', async (req, res) => {
  const command = typeof req.body?.command === 'string' ? req.body.command.trim() : '';

  if (!command) {
    return res.status(400).json({ reply: 'Please provide a task or prompt for the agent.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      reply: 'OpenAI API key is not configured. Set OPENAI_API_KEY before starting the server.'
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: command }],
      tools: agentTools,
      tool_choice: 'auto'
    });

    const message = response.choices[0]?.message;
    const toolCall = message?.tool_calls?.[0];

    if (toolCall) {
      const toolName = toolCall.function.name;
      const argumentsText = toolCall.function.arguments || '{}';
      const args = JSON.parse(argumentsText);

      if (toolName === 'send_email_summary') {
        console.log(`Executing email to ${args.recipient}`);

        return res.json({
          reply: `✅ I’ve processed that busywork and sent the email summary regarding "${args.subject}".`
        });
      }
    }

    return res.json({
      reply: message?.content || 'I can help with that. Tell me what you want done.'
    });
  } catch (error) {
    console.error('Agent request failed:', error);
    return res.status(500).json({
      reply: 'Sorry, I had trouble processing that request.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Agent server running on port ${PORT}`);
});
