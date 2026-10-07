export interface AIProvider {
  generateStructured(prompt: string, schema: object): Promise<object>;
  generateText(prompt: string): Promise<string>;
  streamChat(messages: Array<{ role: string; content: string }>): AsyncIterable<string>;
}
