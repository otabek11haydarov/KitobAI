export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Workspace {
  id: string;
  bookId: string;
  bookTitle: string;
  messages: Message[];
}

export interface BookRecommendation {
  title: string;
  reason: string;
  classification: string;
  themes: string[];
  characters: string[];
  style: string;
  roadmap: {
    stage: 'Boshlang‘ich' | 'O‘rta' | 'Murakkab';
    nextSteps: string[];
  };
}

export interface FinishedAnalysis {
  bookId: string;
  title: string;
  philosophicalMeaning: string;
  perspectives: string[];
  hiddenMessages: string[];
  comparisons: string[];
  criticalInsights: string;
}

export interface AppState {
  workspaces: Workspace[];
  plannedBooks: BookRecommendation[];
  finishedBooks: FinishedAnalysis[];
}

export const INITIAL_STATE: AppState = {
  workspaces: [
    {
      id: 'ws-1',
      bookId: '1',
      bookTitle: '1984',
      messages: [
        { role: 'assistant', content: 'Salom! "1984" asari bo‘yicha tahlillarimizni boshlashga tayyorman.', timestamp: new Date() }
      ]
    }
  ],
  plannedBooks: [],
  finishedBooks: []
};
