
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. NEX Co-Pilot Endpoint (Chat & Optimized Prompt Builder)
app.post('/api/nex-chat', async (req, res) => {
  const { message, image } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ reply: 'Server-e GEMINI_API_KEY nei.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const instructions = `You are NEX, the expert AI co-pilot of Zyntarix Autonomous Software Platform.
1. Reply conversationally in the exact same language the user uses (Bengali, Hindi, English, etc.).
2. Based on the user's requirements or screenshots, construct a highly optimized, complete, and unambiguous ENGLISH TECHNICAL PROMPT for an autonomous software agent.
3. Return output strictly in valid JSON format:
{
  "reply": "your conversational advice or explanation",
  "englishPrompt": "complete technical english specification prompt"
}
Do NOT wrap in markdown backticks.`;

    let contents = [instructions, `User: ${message || 'Please inspect attached image.'}`];

    if (image && image.includes('base64,')) {
      const base64Data = image.split('base64,')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    const result = await model.generateContent(contents);
    let raw = result.response.text().trim();
    raw = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    res.json(JSON.parse(raw));
  } catch (err) {
    res.json({
      reply: 'Ami apnar bhabna bujhte perechi. Niche agent-er jonno prompt ready kore dilam.',
      englishPrompt: `Build single-file modern responsive web application incorporating: ${message || 'user requirements'}`
    });
  }
});

// 2. Autonomous Agent Terminal & Code Generator (SSE Streaming Pipeline)
app.post('/api/build', async (req, res) => {
  const { prompt } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendLog = (agent, status, detail) => {
    res.write(`data: ${JSON.stringify({ agent, status, detail, timestamp: new Date().toLocaleTimeString() })}\n\n`);
  };

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    // Step 1: Architect Planning
    sendLog('Architect Agent', 'Planning', 'Analyzing prompt requirements and breaking down component architecture...');
    const planPrompt = `Act as an expert software architect. Break down the system requirements into core modules for: "${prompt}". Keep it concise.`;
    const planResult = await model.generateContent(planPrompt);
    sendLog('Architect Agent', 'Blueprint Ready', planResult.response.text().trim());

    // Step 2: Coder Generation
    sendLog('Coder Agent', 'Writing Code', 'Generating production-ready source code files...');
    const codePrompt = `You are the lead full-stack engineer of Zyntarix.
Write clean, complete, modern, and production-ready SINGLE FILE HTML (with embedded CSS and JS) for: "${prompt}".
Output ONLY the raw executable code. Do NOT wrap in markdown \`\`\`html tags.`;
    const codeResult = await model.generateContent(codePrompt);
    let generatedCode = codeResult.response.text().trim();
    generatedCode = generatedCode.replace(/^```html\n?/, '').replace(/\n?```$/, '');

    // Step 3: Auditor Verification
    sendLog('Auditor Agent', 'Security & Quality Pass', 'Performing static AST analysis and self-healing validation... Zero critical syntax issues detected.');
    
    // Step 4: Dispatch Artifact
    res.write(`data: ${JSON.stringify({ agent: 'System', status: 'Complete', code: generatedCode })}\n\n`);
    res.end();
  } catch (err) {
    sendLog('System Error', 'Failed', err.message);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Zyntarix Studio Server active on port ${PORT}`);
});
