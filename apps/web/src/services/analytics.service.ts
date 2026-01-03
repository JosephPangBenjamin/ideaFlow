import { api } from './api';

export interface TrackEventPayload {
  eventName: string;
  metadata?: Record<string, any>;
}

export const analyticsService = {
  track: async (payload: TrackEventPayload) => {
    const response = await api.post('/analytics/track', payload);
    return response.data;
  },
};
