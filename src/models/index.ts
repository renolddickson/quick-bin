export interface DataType {
    type: 'text' | 'code';
    name: string;
    language?: string;
    content: string;
  }