const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const generatePresentation = async (req, res) => {
  try {
    const { topic, slideCount = 5 } = req.body;

    const prompt = `
You are a presentation creator. Generate a presentation about "${topic}" with ${slideCount} slides.

Return ONLY a valid JSON object in this exact format, no markdown, no extra text:
{
  "title": "Presentation title here",
  "slides": [
    {
      "type": "mcq",
      "question": "Question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "settings": {
        "timer": 30,
        "anonymous": true,
        "showResults": true
      }
    },
    {
      "type": "wordcloud",
      "question": "Question here?",
      "options": [],
      "settings": {
        "timer": 60,
        "anonymous": true,
        "showResults": true
      }
    },
    {
      "type": "opentext",
      "question": "Question here?",
      "options": [],
      "settings": {
        "timer": 60,
        "anonymous": true,
        "showResults": true
      }
    }
  ]
}

Mix slide types. Make questions engaging and relevant to "${topic}".
`;

    const completion = await client.chat.completions.create({
      model: "google/gemma-4-26b-a4b-it:free",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const clean = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(clean);

    res.json(parsed);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "AI generation failed",
      error: err.message,
    });
  }
};

module.exports = {
  generatePresentation,
};
