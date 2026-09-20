export interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
  status: "published" | "draft" | "deploying";
  thumbnailUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  credits: number;
  maxCredits: number;
  plan: string;
}

export interface StepLog {
  id: string;
  title: string;
  description: string;
  status: "success" | "warning" | "error";
  timestamp: string;
}

