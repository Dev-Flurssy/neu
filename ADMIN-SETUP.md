# 🔐 Admin Setup Guide

Quick reference for creating and managing admin accounts in NEU Notes.

---

## 🚀 Quick Start (First Time Setup)

### Step 1: Create Your First Admin

```bash
# Navigate to project directory
cd neu

# Create admin account (replace with your details)
npx tsx scripts/create-admin.ts your-email@example.com YourPassword123 "Your Name"
```

**Example:**
```bash
npx tsx scripts/create-admin.ts admin@neunotes.com SecurePass123 "Admin User"
```

### Step 2: Log In

1. Go to `http://localhost:3000/login`
2. Enter the email and password you just created
3. You'll see an "Admin" link in the navigation bar
4. Click it to access the admin panel at `/admin`

---

## 📋 Two Ways to Create Admins

### Method 1: Create New Admin (From Scratch)

**When to use:** Creating a brand new admin account

```bash
npx tsx scripts/create-admin.ts <email> <password> <name>
```

**Examples:**
```bash
# Basic example
npx tsx scripts/create-admin.ts admin@example.com Pass123456 "Admin"

# With school email
npx tsx scripts/create-admin.ts 20253807@std.neu.edu.tr MySecure123 "NEU Admin"

# Name with spaces (use quotes)
npx tsx scripts/create-admin.ts john@example.com Password123 "John Doe"
```

**What it does:**
- ✅ Creates new user account
- ✅ Sets role to "admin"
- ✅ Hashes password securely
- ✅ Auto-verifies email
- ✅ Ready to use immediately

---

### Method 2: Promote Existing User

**When to use:** User already has an account and needs admin access

```bash
npx tsx scripts/make-admin.ts <email>
```

**Examples:**
```bash
# Promote yourself
npx tsx scripts/make-admin.ts your-email@example.com

# Promote another user
npx tsx scripts/make-admin.ts john@example.com
```

**What it does:**
- ✅ Finds existing user
- ✅ Changes role to "admin"
- ✅ Keeps all user data
- ✅ No password change

---

## 🌐 Web-Based Admin Management

Once you're logged in as admin, you can manage admins through the web interface:

### Access Admin Panel
1. Log in to your account
2. Click "Admin" in the navigation bar
3. You'll see the admin dashboard

### Create Admin via Web UI
1. Go to `/admin/manage` or click "Manage Admins" button
2. Choose "Create New Admin" tab
3. Fill in email, name, and password
4. Click "Create Admin Account"

### Promote User via Web UI
1. Go to `/admin/manage` or click "Manage Admins" button
2. Choose "Promote Existing User" tab
3. Enter user's email
4. Click "Promote to Admin"

**OR**

1. Go to `/admin`
2. Click "Users" tab
3. Find the user
4. Click "Make Admin" button

---

## 🔄 Managing Admin Roles

### Demote Admin to User

**Option 1 - Admin Panel:**
1. Log in as admin
2. Go to `/admin`
3. Click "Users" tab
4. Find the admin user
5. Click "Remove Admin"

**Option 2 - Prisma Studio:**
```bash
npx prisma studio
```
1. Open User table
2. Find the user
3. Change `role` from "admin" to "user"
4. Save

**Option 3 - Command Line:**
```bash
# No built-in script, but you can use Prisma Studio or the web UI
```

---

## 🎯 Admin Privileges

Admins have access to:

- ✅ **Admin Panel** (`/admin`)
  - View system statistics
  - Monitor API usage
  - Track user activity

- ✅ **User Management** (`/admin` → Users tab)
  - View all users
  - See user statistics (notes, API calls)
  - Promote users to admin
  - Demote admins to users
  - Delete user accounts

- ✅ **Admin Management** (`/admin/manage`)
  - Create new admin accounts
  - Promote existing users

- ✅ **API Usage Monitoring** (`/admin` → API Usage tab)
  - View recent API calls
  - Track success/failure rates
  - Monitor system performance

---

## 🚨 Troubleshooting

### "User already exists"
**Problem:** Email is already registered  
**Solution:** Use `make-admin.ts` to promote existing user
```bash
npx tsx scripts/make-admin.ts existing-email@example.com
```

### "User not found"
**Problem:** User hasn't signed up yet  
**Solution:** Use `create-admin.ts` to create new admin
```bash
npx tsx scripts/create-admin.ts email@example.com Password123 "Name"
```

### "Password must be at least 6 characters"
**Problem:** Password too short  
**Solution:** Use a password with 6+ characters

### "Command not found: tsx"
**Problem:** tsx not installed  
**Solution:** npx will auto-install it, just run the command again

### "Database connection failed"
**Problem:** Database not running or wrong connection string  
**Solution:** 
1. Check if database is running
2. Verify `DATABASE_URL` in `.env` file
3. Run `npx prisma generate` if needed

### Can't see Admin link in navbar
**Problem:** Not logged in as admin  
**Solution:** 
1. Make sure you created/promoted your account
2. Log out and log back in
3. Check browser console for errors

---

## 📁 File Locations

```
neu/
├── scripts/
│   ├── create-admin.ts      # Create new admin
│   ├── make-admin.ts         # Promote existing user
│   └── README.md             # Detailed documentation
├── lib/admin/
│   ├── create-admin.ts       # Admin creation utility
│   ├── promote-user.ts       # User promotion utility
│   └── index.ts              # Exports
├── app/admin/
│   ├── page.tsx              # Admin dashboard
│   └── manage/
│       └── page.tsx          # Admin management UI
└── app/api/admin/
    ├── create-admin/
    │   └── route.ts          # Create admin API
    ├── stats/
    │   └── route.ts          # Stats API
    └── users/
        └── route.ts          # User management API
```

---

## 🔒 Security Best Practices

1. **Use Strong Passwords**
   - Minimum 6 characters (enforced)
   - Recommended: 12+ characters with mix of letters, numbers, symbols

2. **Limit Admin Accounts**
   - Only create admin accounts for trusted users
   - Regularly audit admin list

3. **Monitor Admin Activity**
   - Check API usage logs regularly
   - Review user management actions

4. **Secure Your Environment**
   - Keep `.env` files private
   - Never commit passwords to git
   - Use environment variables in production

---

## 📚 Additional Resources

- **Full Documentation:** `neu/scripts/README.md`
- **Prisma Studio:** `npx prisma studio` (visual database editor)
- **Database Migrations:** `npx prisma migrate dev`
- **Generate Prisma Client:** `npx prisma generate`

---

## 💡 Tips

- **First time?** Use `create-admin.ts` to create your first admin
- **Already have account?** Use `make-admin.ts` to promote yourself
- **Prefer UI?** Use the web-based admin management at `/admin/manage`
- **Need to demote?** Use the admin panel Users tab
- **Forgot password?** Use the "Forgot password?" link on login page

---

**Need help?** Check the troubleshooting section above or review the detailed documentation in `scripts/README.md`
