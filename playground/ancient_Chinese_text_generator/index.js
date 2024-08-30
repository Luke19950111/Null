import { Client } from "@gradio/client";

const client = await Client.connect("https://s5k.cn/api/v1/studio/chostem/ancient_Chinese_text_generator/gradio/");
const result = await client.predict("/predict", { 		
		modern_text: "吃饭了吗", 
});

console.log(result.data);