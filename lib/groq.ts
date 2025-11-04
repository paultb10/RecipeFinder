import { Recipe } from '../types';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const systemPrompt = `You are a recipe assistant. The user will provide a general description. 
You must return ONLY a JSON array of 3 recipes that match. 
Each recipe object must follow this exact TypeScript interface:
{ 
  id: string; // use a slug of the title, e.g., "mashed-potatoes"
  title: string; 
  prepTime: string; 
  ingredients: string[]; 
  instructions: string[]; 
  imageUrl: string; // placeholder, will be replaced with a real image later
}
Do not include any text, explanation, or markdown formatting outside of the JSON array.
Return placeholder imageUrl like: "https://via.placeholder.com/400x300/3f3f46/ffffff?text=Recipe+Image"`;


async function fetchImageForRecipe(title: string): Promise<string> {
    try {
        const query = encodeURIComponent(title);
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
        );
        const data = await res.json();
        const image = data.results?.[0]?.urls?.small_s3 || data.results?.[0]?.urls?.small || data.results?.[0]?.urls?.regular;

        if (image) return image;

        return `https://via.placeholder.com/400x300/3f3f46/ffffff?text=${encodeURIComponent(title)}`;
    } catch (err) {
        console.error('Unsplash image fetch failed:', err);
        return `https://via.placeholder.com/400x300/3f3f46/ffffff?text=${encodeURIComponent(title)}`;
    }
}


export const fetchRecipesFromAI = async (prompt: string): Promise<Recipe[]> => {
    if (!GROQ_API_KEY) throw new Error('Missing GROQ_API_KEY');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) throw new Error('No content in AI response');

        const jsonMatch = content.match(/(\[[\s\S]*\])/);

        if (!jsonMatch || !jsonMatch[0]) {
            console.error('AI response did not contain a valid JSON array. Received:', content);
            throw new Error('Could not extract JSON from AI response');
        }

        const jsonString = jsonMatch[0];
        const recipes: Recipe[] = JSON.parse(jsonString);

        for (const recipe of recipes) {
            recipe.imageUrl = await fetchImageForRecipe(recipe.title);
        }

        return recipes;
    } catch (error) {
        console.error('Failed to fetch recipes:', error);
        return [];
    }
};