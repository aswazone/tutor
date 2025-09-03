import { Candidate } from "@google/genai";

export const aiContentToJSON = <U>(candidates: Candidate[]): U => {
    if (candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonText = candidates[0].content.parts[0].text
            .replace(/```json\n/, '')
            .replace(/```/, '');
        return JSON.parse(jsonText);
    }
    return {} as U;
}
