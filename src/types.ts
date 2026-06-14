export type ViewType = 
  | 'landing' 
  | 'privacy' 
  | 'signin' 
  | 'signup' 
  | 'profile' 
  | 'dashboard' 
  | 'project-detail' 
  | 'swipe';

export interface StyleAsset {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  loveCount: number;
  skipCount: number;
  totalSwipes: number;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  description: string;
  status: 'Active' | 'Completed' | 'Archived';
  createdDate: string;
  assets: StyleAsset[];
  team: string[];
}

export interface SwipeSession {
  id: string;
  userId: string;
  timestamp: string;
  loves: string[]; // assetIds
  skips: string[]; // assetIds
}
