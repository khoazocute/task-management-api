const DEFAULT_AI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_AI_MODEL = "gpt-4o-mini";

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getAiConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "",
    apiUrl: process.env.OPENAI_API_URL || process.env.AI_API_URL || DEFAULT_AI_URL,
    model: process.env.OPENAI_MODEL || process.env.AI_MODEL || DEFAULT_AI_MODEL,
  };
}

function buildSystemPrompt(userLabel) {
  const normalizedUserLabel = userLabel || "nguoi dung";

  return [
    "Ban la tro ly AI trong ung dung TaskFlow.",
    `Nguoi dang dung ung dung la: ${normalizedUserLabel}.`,
    "Hay tra loi ngan gon, ro rang, than thien bang tieng Viet.",
    "Neu nguoi dung hoi ve task va hieu suat, uu tien dua ra goi y hanh dong cu the.",
  ].join(" ");
}

module.exports.chat = async (payload) => {
  const { message, history, userLabel } = payload;

  if (!message || message.trim() === "") {
    throw createHttpError(400, "Noi dung tin nhan khong duoc de trong");
  }

  const { apiKey, apiUrl, model } = getAiConfig();

  if (!apiKey) {
    throw createHttpError(500, "Backend chua cau hinh OPENAI_API_KEY hoac AI_API_KEY");
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && typeof item.content === "string" && ["user", "assistant"].includes(item.role))
        .slice(-10)
    : [];

  const messages = [
    {
      role: "system",
      content: buildSystemPrompt(userLabel),
    },
    ...safeHistory,
    {
      role: "user",
      content: message.trim(),
    },
  ];

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw createHttpError(response.status, data.error?.message || data.message || "Khong goi duoc AI provider");
  }

  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw createHttpError(502, "AI khong tra ve noi dung hop le");
  }

  return {
    code: 200,
    message: "Nhan phan hoi AI thanh cong",
    data: {
      reply,
      model,
    },
  };
};
