import { Router, type IRouter } from "express";
import { GenerateEmailReplyBody } from "@workspace/api-zod";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router: IRouter = Router();

router.post("/email/generate", async (req, res) => {
  try {
    const parsed = GenerateEmailReplyBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { emailContent, tone, useCase, length } = parsed.data;

    const lengthGuide = {
      short: "2-3 sentences per reply",
      medium: "1-2 short paragraphs per reply",
      detailed: "2-3 paragraphs per reply with thorough coverage",
    }[length];

    const toneGuide = {
      professional: "formal, business-appropriate, concise and polished",
      friendly: "warm, approachable, personable but still professional",
      firm: "assertive, direct, confident, clear boundaries",
      empathetic: "compassionate, understanding, emotionally aware",
    }[tone];

    const useCaseGuide = {
      "general-work": "standard workplace communication",
      "customer-support": "customer service and support context",
      recruiter: "recruiting and hiring context",
      client: "client relationship management",
    }[useCase];

    const systemPrompt = `You are an expert email reply assistant. Generate highly effective email replies that are tailored to the user's context.

Your responses MUST be valid JSON matching this exact schema:
{
  "bestReply": "string - the best recommended reply",
  "alternativeReplies": ["string - alternative 1", "string - alternative 2"],
  "shortReply": "string - mobile-friendly 1-2 sentence version",
  "suggestedSubject": "string - suggested subject line starting with Re:",
  "sentiment": "string - detected emotional sentiment of the incoming email (e.g. 'frustrated', 'curious', 'urgent', 'polite', 'aggressive', 'anxious')",
  "intent": "string - what the sender wants (e.g. 'seeking information', 'requesting approval', 'expressing concern', 'scheduling a meeting')",
  "riskLevel": "low" | "medium" | "high",
  "riskReason": "string - brief explanation if medium/high risk, empty string if low"
}

Tone: ${toneGuide}
Use Case: ${useCaseGuide}
Reply Length: ${lengthGuide}

Rules:
- Do not add placeholders like [Your Name] - write complete replies
- Do not use generic filler phrases
- Each reply must feel distinct and offer a genuinely different angle
- The shortReply must be standalone and usable on its own
- Only output valid JSON, nothing else`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Please generate email replies for this email:\n\n${emailContent}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      res.status(500).json({ error: "Unexpected response from AI" });
      return;
    }

    let parsed2: unknown;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed2 = JSON.parse(jsonMatch[0]);
    } catch {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    res.json(parsed2);
  } catch (err) {
    req.log.error({ err }, "Failed to generate email reply");
    res.status(500).json({ error: "Failed to generate email reply" });
  }
});

export default router;
