export interface Project {
  title: string;
  description: string;
  techStack: string;
  link: string;
}

export interface WorkExp {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  projects: Project[];
  achievements: string[];
  workExperience: WorkExp[];
  createdAt?: bigint;
  updatedAt?: bigint;
}

export interface Permission {
  website: string;
  allowedFields: string[];
  grantedAt: bigint;
}

export interface FormField {
  label: string;
  value: string;
  matched: boolean;
}