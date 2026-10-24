export type QuestionType = 'single' | 'multiple' | 'judge';

export interface Question {
    id: string;
    type: QuestionType;
    stem: string;
    options?: string[];
    answer: string | string[];
    score?: number;
    analysis?: string;
}