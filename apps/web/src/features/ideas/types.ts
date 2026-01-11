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
  sources?: IdeaSource[];
  userId: string;
  tasks?: Array<{ id: string; status: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaDto {
  content: string;
  sources?: IdeaSource[];
}

export interface UpdateIdeaDto {
  content?: string;
  sources?: IdeaSource[];
}
