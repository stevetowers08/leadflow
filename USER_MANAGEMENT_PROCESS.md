# User Management Process Guide

## Overview
This guide explains how to add users and assign access types in the 4Twenty CRM system.

## Current Setup (Temporary)
- **All users are currently administrators** for testing purposes
- This allows everyone to access admin features and user management

## User Management Access

### How to Access User Management:
1. **Via Settings**: Click "Settings" in sidebar → "Users" tab
2. **Direct Admin Panel**: Settings → Users → "Open User Management" button

### What Administrators Can Do:
- ✅ View all users in the system
- ✅ Create new user accounts
- ✅ Update user roles and permissions
- ✅ Activate/deactivate users
- ✅ Manage business information
- ✅ Configure system settings

## User Roles & Access Types

### 1. Administrator
**Full system access:**
- User management (create, edit, delete users)
- System settings and configuration
- Business information management
- All CRM data access
- Reporting and analytics

### 2. Recruiter (Default for new users)
**Standard CRM access:**
- View and edit leads, companies, jobs
- Create opportunities
- Access reporting
- Personal settings only

### 3. Viewer (Read-only)
**Limited access:**
- View leads, companies, jobs
- View reports
- Personal settings only
- Cannot edit data

## Adding New Users

### Method 1: Through Admin Panel
1. Go to **Settings** → **Users** tab
2. Click **"Open User Management"**
3. Click **"Add User"** button
4. Fill in user details:
   - Email address
   - Full name
   - Role (Administrator, Recruiter, Viewer)
   - Account status (Active/Inactive)
5. Click **"Create User"**

### Method 2: Using Promotion Script
```bash
# Promote existing user to admin
node scripts/promote-user-to-admin.js user@example.com
```

## Assigning Access Types

### Role Assignment Process:
1. **Access User Management** (Settings → Users → Open User Management)
2. **Find the user** in the user list
3. **Click the role dropdown** next to their name
4. **Select appropriate role:**
   - **Administrator**: Full access
   - **Recruiter**: Standard CRM access
   - **Viewer**: Read-only access
5. **Changes save automatically**

### Role Permissions Matrix:

| Feature | Administrator | Recruiter | Viewer |
|---------|---------------|-----------|--------|
| User Management | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| Business Info | ✅ | ❌ | ❌ |
| Create Leads | ✅ | ✅ | ❌ |
| Edit Leads | ✅ | ✅ | ❌ |
| View Leads | ✅ | ✅ | ✅ |
| Create Companies | ✅ | ✅ | ❌ |
| Edit Companies | ✅ | ✅ | ❌ |
| View Companies | ✅ | ✅ | ✅ |
| Create Jobs | ✅ | ✅ | ❌ |
| Edit Jobs | ✅ | ✅ | ❌ |
| View Jobs | ✅ | ✅ | ✅ |
| Reporting | ✅ | ✅ | ✅ |
| Personal Settings | ✅ | ✅ | ✅ |

## Business Information Management

### What Administrators Can Configure:
- **Company Details**: Name, email, phone, website
- **Business Address**: Physical location
- **Industry**: Business sector
- **Company Size**: Number of employees
- **Business Description**: Company overview
- **Support Information**: Contact details

### Access: Settings → Admin tab → Business Information section

## Security Considerations

### Current Temporary Setup:
- ⚠️ **All users are administrators** (for testing only)
- ⚠️ **No access restrictions** currently active

### Production Setup (Recommended):
1. **Assign proper roles** based on job functions
2. **Limit administrator access** to IT/management only
3. **Use Viewer role** for read-only access needs
4. **Regular access audits** to ensure proper permissions

## Troubleshooting

### User Can't Access Features:
1. Check their role in User Management
2. Verify account is active
3. Ensure they have proper permissions for the feature

### Admin Features Not Showing:
1. Confirm user has "Administrator" role
2. Check if temporary admin setting is still active
3. Refresh browser after role changes

### Adding Users Fails:
1. Verify email address is valid
2. Check if user already exists
3. Ensure service role key is configured

## Next Steps

### For Production:
1. **Remove temporary admin access** for all users
2. **Assign proper roles** based on job functions
3. **Implement proper user onboarding** process
4. **Set up role-based access controls**
5. **Create user management policies**

### Recommended User Distribution:
- **1-2 Administrators**: IT/Management
- **Most users**: Recruiter role
- **Read-only users**: Viewer role




