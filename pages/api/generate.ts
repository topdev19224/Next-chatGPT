import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

type RequestData = {
  messageText: string;
};


if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

let message_junk = "";

const handler = async (req: Request): Promise<Response> => {
  
  const { messageText } = (await req.json()) as RequestData;

  message_junk += `${messageText} \n` ;

  if (!messageText) {
    return new Response("No prompt in the request, Please check README.md else please contact via my mail: zhenghu61919@gmail.com", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt: message_junk,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;