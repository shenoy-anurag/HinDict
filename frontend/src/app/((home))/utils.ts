const MAX_WORDS: number = 5;

export function countWords(str: string): number {
    // Trim leading/trailing spaces and split the string by spaces
    const words = str.trim().split(/\s+/);
    // Filter out empty strings in case of multiple spaces
    const filteredWords = words.filter(word => word.length > 0);
    // Return the number of words
    return filteredWords.length;
}

export function validateUserPrompt(text: string): boolean {
    // Currently only checking to make sure the prompt is a word/phrase of length upto 5 words.
    const wordCount = countWords(text);
    if (wordCount <= MAX_WORDS) return true;
    return false;
}