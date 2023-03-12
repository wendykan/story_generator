import React, { useState } from "react";
import "./App.css";

import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENAI_KEY;
const model = "gpt-3.5-turbo";

const fetchData = async (childname: string, theme: string, lang: string) => {
  console.log(childname, theme, lang)

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      messages: [{role: 'system', content: `Create a bedtime story with the main character named ${childname} and the story happened in the ${theme}.` + (lang === "zh" ? "請用中文說這個故事" : '')}],
      model: model,
      max_tokens: 1000,
      temperature: 1,
      n: 1,
      top_p: 0.9,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  console.log(`Create a bedtime story with the main character named ${childname} and the story happened in the ${theme}.` + (lang === "zh" ? "請用中文說這個故事" : ''))
  return response.data.choices[0].message.content;
};

function ChattyApp() {
  const [childname, setInput] = useState("");
  const [theme, setTheme] = useState("");
  const [lang, setLang] = useState("")
  const [completedSentence, setCompletedSentence] = useState("");

  async function handleSubmit() {
    try {
      const completedSentence = await fetchData(childname, theme, lang);
      setCompletedSentence(completedSentence);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container">
      <h3>Your child's name is: </h3>
      <textarea
        value={childname}
        onChange={(event) => setInput(event.target.value)}
        rows={1}
        placeholder=""
      />
      <h3>The story happened in the: 
      <select onChange={(event) => setTheme(event.target.value)}>
        <option value="anywhere">Choose a theme ...</option>
        <option value="ocean">Ocean</option>
        <option value="forest">Forest</option>
        <option value="farm">Farm</option>
      </select>
      <br /></h3>
      <h3>I'd like the story told in:  
      <input type="radio" value="en" name="gender" onChange={(event) => setLang(event.target.value)} /> English
      <input type="radio" value="zh" name="gender" onChange={(event) => setLang(event.target.value)}/> 中文
      </h3>
      <br />
      <button className="button" onClick={handleSubmit}>
        Generate a bedtime story
      </button>
      {completedSentence && <p>Generated story: {completedSentence}</p>}
    </div>
  );
}

export default ChattyApp;