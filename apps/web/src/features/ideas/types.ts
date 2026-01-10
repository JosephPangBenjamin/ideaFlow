export type IdeaSource =
  | {
      type: 'link';
      url: string;
      meta?: { title?: string; description?: string; image?: { url: string }; siteName?: string };
    }
  | { type: 'image'; url: string; width?: number; height?: number }
  | { type: 'text'; content: string };

export interface Idea {
  id: string;
  content: string;
  source?: IdeaSource;
  userId: string;
  tasks?: Array<{ id: string; status: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaDto {
  content: string;
  source?: IdeaSource;
}

export interface UpdateIdeaDto {
  content?: string;
  source?: IdeaSource;
}
