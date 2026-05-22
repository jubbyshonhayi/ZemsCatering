export async function handler(event) {
  const { message, memory, siteContent, faqContent } = JSON.parse(event.body);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
  role: "system",
  content: `
  You are a friendly and warm assistant for Zems Cakes and Catering.
  IMPORTANT RULES:
  - Keep answers short, clear, and helpful.
  - Do NOT talk endlessly.
  - Use a friendly, caring tone.
  - Answer using FAQ first, then website content.
  - If pricing or availability is mentioned, give general ranges only.
  - For exact prices, bookings, or urgent orders, encourage contacting via WhatsApp.
  - If information is not available, say so honestly.
  - Focus on Zems cakes and catering services, no outside conversations. BUT remain respectful and helpful.
  - Combine FAQ and website content for better answers.
  - Do not help with ingredients, cooking/baking process, how to bake or cook.
  
  FAQ:
  ${faqContent}
  
  WEBSITE CONTENT:
  ${siteContent}
  `},

        ...memory,
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  let reply = "Sorry, I couldn't get a response. Please try again.";
  if (data?.choices && data.choices.length > 0) {
    reply = data.choices[0]?.message?.content || reply;
 }
 console.log("OpenAI API response:", data);
 
 return {
  statusCode: 200,
  body: JSON.stringify({ reply })
 };

}