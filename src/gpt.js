import axios from 'axios';

const api_url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const headers = {
  Authorization: `Bearer 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`,
  'Content-Type': 'application/json',
};

const generateText = async (prompt) => {
  try {
    const response = await axios.post(api_url, { prompt, max_tokens: 100 }, { headers });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error(error);
    return '';
  }
};

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = () => {
  rl.question('You: ', async (input) => {
    const output = await generateText(input);
    console.log(`AI: ${output}`);
    promptUser();
  });
};

promptUser();
