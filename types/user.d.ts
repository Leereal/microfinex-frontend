export interface Branch {
  id: number;
  name: string;
}

export interface User {
  id: number;
  gender: string;
  phone: string | null;
  profile_photo: string;
  branches: Branch[];
  last_login: string;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string | null;
  active_branch: number;
  groups: any[];
  user_permissions: any[];
  admin: boolean;
}
