import { GoogleGenAI, Type } from "@google/genai";
import { AIReportData, AttendanceRecord, TenantType } from "../types";

// Safety check for API key
const API_KEY = process.env.API_KEY || '';

export const generateAttendanceReport = async (
  records: AttendanceRecord[],
  tenantType: TenantType,
  dateRange: string
): Promise<AIReportData> => {
  if (!API_KEY) {
    console.warn("No API Key found. Returning mock data.");
    return {
      summary: "API Key missing. This is a mock summary indicating that attendance has been relatively stable this week, with a slight dip on Thursday.",
      risks: ["Consistently late arrivals in Class 10A", "Friday absenteeism checks needed"],
      actions: ["Send reminder SMS to late students", "Review shift scheduling for next week"],
      confidenceScore: 0.95
    };
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Aggregate data to avoid sending PII (Personally Identifiable Information)
  const total = records.length;
  const present = records.filter(r => r.status === 'PRESENT').length;
  const absent = records.filter(r => r.status === 'ABSENT').length;
  const late = records.filter(r => r.status === 'LATE').length;
  
  const stats = {
    totalRecords: total,
    presentCount: present,
    absentCount: absent,
    lateCount: late,
    tenantType: tenantType,
    period: dateRange
  };

  const prompt = `
    You are an AI analytics assistant for a ${tenantType} attendance system.
    Analyze the following aggregated statistics:
    ${JSON.stringify(stats)}

    Provide a structured report including an executive summary, top risks (e.g., dropping attendance), and actionable recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ["summary", "risks", "actions", "confidenceScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    
    return JSON.parse(text) as AIReportData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "Failed to generate report due to AI service error.",
      risks: [],
      actions: [],
      confidenceScore: 0
    };
  }
};
