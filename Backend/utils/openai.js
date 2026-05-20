import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {

  const options = {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },

    body: JSON.stringify({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "user",
          content: message
        }
      ]
    })

  };

  try {

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    // handle OpenAI errors safely
    if (!response.ok) {

      return data.error?.message ||
        "OpenAI API Error";

    }

    // safe return
    return (
      data?.choices?.[0]?.message?.content ||
      "No response generated."
    );

  } catch (err) {

    console.log("OPENAI ERROR:", err);

    return "Something went wrong.";

  }
};

export default getOpenAIAPIResponse;