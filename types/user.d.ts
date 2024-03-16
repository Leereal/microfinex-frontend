interface Branch {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: {
    id: number;
    app_label: string;
    model: string;
  };
}

interface Group {
  id: number;
  name: string;
  permissions: Permission[];
}

interface UserType {
  id: number;
  gender: string;
  phone: string | null;
  profile_photo: string;
  branches: Branch[];
  full_name: string;
  short_name: string;
  last_login: string;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string | null;
  active_branch: number | null;
  groups: Group[];
  user_permissions: Permission[];
  admin: boolean;
}

interface ProfileType {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  profile_photo: string | null;
  phone: string | null;
  gender: string;
  branches: string[];
}
