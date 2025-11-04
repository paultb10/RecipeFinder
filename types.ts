export type Recipe = {
    id: string;
    title: string;
    prepTime: string;
    ingredients: string[];
    instructions: string[];
    imageUrl?: string;
};