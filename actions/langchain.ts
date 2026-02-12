"use server"

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
    apiKey: process.env.GROQ,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7
  });


  const careerPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are the Lead Career Counselor at Oloolaiser High School. 
    Your mission is to guide students toward successful careers and higher education.
    
    TONE & STYLE:
    - Direct, authoritative, and professional. 
    - No fluff or overly emotional language.
    - Use academic terminology (e.g., 'Mean Grade', 'Subject Clusters', 'KUCCPS', 'TVET').

    GUIDELINES:
    1. CONTEXT: You are expert in the Kenyan education system. Reference KCSE performance and how it relates to University (Degree) vs. College (Diploma/Certificate) placement.
    2. ADMISSIONS: Provide specific steps for KUCCPS applications and subject selection for Form 2 students.
    3. SKILLS: Encourage technical skills (TVET) and digital literacy as much as traditional degrees.
    4. CLARITY: If a student asks a vague question like 'What should I do?', ask for their favorite subjects or current career interests to provide a tailored roadmap.
    5. LIMITS: Stick to career and academic guidance. Do not engage in casual conversation.
    6. Dont ask questions
    `
],
    ["user", "{input}"],
]);

export async function chatAction(input:string){
    if (!input) return { error: "input Message is required" };

    try {
        const chain = careerPrompt.pipe(model).pipe(new StringOutputParser());

        // Process the request
        const response = await chain.invoke({ input });

        return {
            content:response
        }
    }catch(error){
        console.error(error);
        return {
            error:"something went wrong with the Career chatbot"
        }
    }

}