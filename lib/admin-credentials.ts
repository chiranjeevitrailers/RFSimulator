// Admin credentials for 5GLabX platform
// IMPORTANT: Change these credentials in production!

export const ADMIN_CREDENTIALS = {
  email: 'admin@5glabx.com',
  password: '5GLabX@Admin2024!',
  username: '5GLabX-Admin',
  role: 'admin',
  permissions: [
    'homepage_edit',
    'user_management',
    'equipment_management',
    'service_management',
    'analytics_view',
    'system_settings'
  ]
};

// Additional admin users (optional)
export const ADDITIONAL_ADMINS = [
  {
    email: 'superadmin@5glabx.com',
    password: 'SuperAdmin@5GLabX2024!',
    username: 'Super-Admin',
    role: 'superadmin',
    permissions: ['*'] // All permissions
  },
  {
    email: 'manager@5glabx.com',
    password: 'Manager@5GLabX2024!',
    username: 'Manager',
    role: 'manager',
    permissions: [
      'homepage_edit',
      'user_management',
      'equipment_management',
      'analytics_view'
    ]
  }
];

// Login credentials for easy access
export const LOGIN_CREDENTIALS = {
  // Main Admin
  admin: {
    email: 'admin@5glabx.com',
    password: '5GLabX@Admin2024!'
  },
  // Super Admin
  superadmin: {
    email: 'superadmin@5glabx.com',
    password: 'SuperAdmin@5GLabX2024!'
  },
  // Manager
  manager: {
    email: 'manager@5glabx.com',
    password: 'Manager@5GLabX2024!'
  }
};

// Function to validate admin credentials
export function validateAdminCredentials(email: string, password: string) {
  const allAdmins = [ADMIN_CREDENTIALS, ...ADDITIONAL_ADMINS];
  
  const admin = allAdmins.find(admin => 
    admin.email === email && admin.password === password
  );
  
  if (admin) {
    return {
      success: true,
      user: {
        email: admin.email,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions
      }
    };
  }
  
  return {
    success: false,
    error: 'Invalid credentials'
  };
}

// Function to check if user has permission
export function hasPermission(userRole: string, userPermissions: string[], requiredPermission: string) {
  if (userRole === 'superadmin') return true;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
}