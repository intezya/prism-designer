import { GoogleGenAI, Type } from "@google/genai";
import { AIThemeResponse, ShapeType, MaterialType } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateThemeFromPrompt = async (prompt: string): Promise<AIThemeResponse | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a visual theme for a 3D abstract scene based on this mood/idea: "${prompt}". 
      Return a JSON object containing color codes (hex), material properties, shape choices.
      For colors, ensure they are valid 6-digit hex codes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeName: { type: Type.STRING, description: "A creative name for the theme" },
            description: { type: Type.STRING, description: "Short explanation of the visual choices" },
            config: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING, description: "Main object hex color" },
                bgColor: { type: Type.STRING, description: "Background hex color" },
                lightColor: { type: Type.STRING, description: "Light source hex color" },
                lightIntensity: { type: Type.NUMBER, description: "Light intensity between 0.5 and 3" },
                metalness: { type: Type.NUMBER, description: "Material metalness 0-1" },
                roughness: { type: Type.NUMBER, description: "Material roughness 0-1" },
                shape: { 
                  type: Type.STRING, 
                  enum: ["Box", "Torus", "Icosahedron", "Octahedron", "Knot"],
                  description: "The geometric shape type"
                },
                material: {
                  type: Type.STRING,
                  enum: ["Standard", "Physical", "Wireframe"],
                  description: "The material shader type"
                },
                rotationSpeed: { type: Type.NUMBER, description: "Self-rotation speed between 0 and 2" },
                scale: { type: Type.NUMBER, description: "Scale of the object (0.5 to 2.5)" }
              },
              required: ["color", "bgColor", "metalness", "roughness", "shape"]
            }
          },
          required: ["themeName", "config"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIThemeResponse;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};