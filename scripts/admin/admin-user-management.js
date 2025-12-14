#!/usr/bin/env node

/**
 * Admin User Management Script
 * Usage:
 *   node scripts/promote-user-to-admin.js <user-email> [role]
 *   node scripts/list-users.js
 *   node scripts/demote-user.js <user-email>
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const AVAILABLE_ROLES = ['admin', 'user'];

async function listUsers() {
  try {
    console.log('👥 Current Users:');
    console.log('================');

    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }

    if (users.users.length === 0) {
      console.log('No users found.');
      return;
    }

    users.users.forEach((user, index) => {
      const role = user.user_metadata?.role || 'recruiter';
      const status = user.email_confirmed_at ? '✅ Verified' : '❌ Unverified';
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Role: ${role}`);
      console.log(`   Status: ${status}`);
      console.log(
        `   Created: ${new Date(user.created_at).toLocaleDateString()}`
      );
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function promoteUserToAdmin(userEmail, role = 'admin') {
  try {
    if (!AVAILABLE_ROLES.includes(role)) {
      console.error(`❌ Invalid role: ${role}`);
      console.error(`Available roles: ${AVAILABLE_ROLES.join(', ')}`);
      process.exit(1);
    }

    console.log(`🔍 Looking for user: ${userEmail}`);

    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.users.find(u => u.email === userEmail);

    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      console.log('Available users:');
      users.users.forEach(u => console.log(`  - ${u.email}`));
      return;
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    console.log(`📋 Current role: ${user.user_metadata?.role || 'recruiter'}`);

    // Update user role
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: role,
        },
      }
    );

    if (updateError) {
      throw new Error(`Failed to update user: ${updateError.message}`);
    }

    console.log(`🎉 Successfully updated user role to: ${role}`);
    console.log('🔄 Please refresh your browser to see the changes');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function demoteUser(userEmail) {
  try {
    console.log(`🔍 Looking for user: ${userEmail}`);

    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.users.find(u => u.email === userEmail);

    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      return;
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    console.log(`📋 Current role: ${user.user_metadata?.role || 'recruiter'}`);

    // Demote to recruiter
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'recruiter',
        },
      }
    );

    if (updateError) {
      throw new Error(`Failed to update user: ${updateError.message}`);
    }

    console.log('🎉 Successfully demoted user to: recruiter');
    console.log('🔄 Please refresh your browser to see the changes');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const command = process.argv[2];
const userEmail = process.argv[3];
const role = process.argv[4];

if (!command) {
  console.log('Admin User Management Script');
  console.log('');
  console.log('Usage:');
  console.log(
    '  node scripts/promote-user-to-admin.js list                    # List all users'
  );
  console.log(
    '  node scripts/promote-user-to-admin.js <email> [role]         # Promote user'
  );
  console.log(
    '  node scripts/promote-user-to-admin.js demote <email>         # Demote user'
  );
  console.log('');
  console.log('Available roles:', AVAILABLE_ROLES.join(', '));
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/promote-user-to-admin.js list');
  console.log(
    '  node scripts/promote-user-to-admin.js steve@example.com admin'
  );
  console.log(
    '  node scripts/promote-user-to-admin.js steve@example.com recruiter'
  );
  console.log(
    '  node scripts/promote-user-to-admin.js demote steve@example.com'
  );
  process.exit(1);
}

if (command === 'list') {
  listUsers();
} else if (command === 'demote') {
  if (!userEmail) {
    console.error('❌ Email required for demote command');
    process.exit(1);
  }
  demoteUser(userEmail);
} else {
  // Assume it's an email for promotion
  if (!command) {
    console.error('❌ Email required');
    process.exit(1);
  }
  promoteUserToAdmin(command, role);
}
