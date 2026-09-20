export type UserRole =
  | "user"
  | "admin";

export type ProjectStatus =
  | "planning"
  | "building"
  | "testing"
  | "ready"
  | "failed"
  | "archived";

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type CreditTransactionType =
  | "purchase"
  | "reservation"
  | "usage"
  | "release"
  | "reward"
  | "refund";

export interface UserAccount {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  planId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreditBalance {
  available: number;
  reserved: number;
  used: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  jobId: string | null;
  projectId: string | null;
  createdAt: string;
}
