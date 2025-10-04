
import { GoogleGenAI, Type } from "@google/genai";
import type { ScreeningReport } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: data,
      mimeType: file.type,
    },
  };
};

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.INTEGER,
      description: "A score from 1 to 100 representing how well the resume matches the job description. Be critical and objective.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise two-to-three sentence summary of the candidate's profile and overall fit for the role.",
    },
    strengths: {
      type: Type.STRING,
      description: "A detailed analysis of the candidate's strengths and how their experience aligns with the key requirements of the job description. Use markdown bullet points for clarity.",
    },
    weaknesses: {
      type: Type.STRING,
      description: "A constructive analysis of potential weaknesses, gaps in experience, or areas where the candidate may not meet the requirements. Use markdown bullet points for clarity.",
    },
    interviewQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of 5 insightful, open-ended interview questions to ask the candidate to probe their skills and experience further based on their resume and the job description.",
    },
  },
  required: ["matchScore", "summary", "strengths", "weaknesses", "interviewQuestions"],
};


export const screenResume = async (resumeFile: File, jobDescription: string): Promise<ScreeningReport> => {
  const imagePart = await fileToGenerativePart(resumeFile);
  
  const systemInstruction = `You are an expert technical recruiter and resume screening assistant with over 20 years of experience. Your task is to provide a detailed, unbiased, and professional analysis of a candidate's resume against a provided job description. Evaluate the candidate's skills, experience, and qualifications strictly based on the documents provided. Provide a structured JSON response.`;
  
  const prompt = `Please analyze the following resume against the job description below.

  **Job Description:**
  ---
  ${jobDescription}
  ---
  
  Evaluate the resume and provide a detailed screening report in the specified JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
          parts: [
            { text: prompt },
            imagePart
          ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const reportData = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches the expected structure
    if (
      typeof reportData.matchScore !== 'number' ||
      typeof reportData.summary !== 'string' ||
      typeof reportData.strengths !== 'string' ||
      typeof reportData.weaknesses !== 'string' ||
      !Array.isArray(reportData.interviewQuestions)
    ) {
      throw new Error("API response does not match the expected format.");
    }

    return reportData as ScreeningReport;
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    throw new Error("Failed to get screening report from the AI. Please check your file and try again.");
  }
};
