# Admin Management Scripts

This folder contains utility scripts for managing admin users in NEU Notes.

## 📁 Location
`neu/scripts/`

## 🔧 Available Scripts

### 1. Create New Admin (create-admin.ts)
Creates a brand new admin user from scratch.

**Command:**
```bash
npx tsx scripts/create-admin.ts <email> <password> <name>
```

**Examples:**
```bash
npx tsx scripts/create-admin.ts admin@example.com MyPassword123 "Admin User"
npx tsx scripts/create-admin.ts 20253807@std.neu.edu.tr SecurePass123 "NEU Admin"
```

**What it does:**
- ✅ Creates a new user account with admin role
- ✅ Hashes password securely with bcrypt
- ✅ Auto-verifies email address
- ✅ Ready to use immediately

**Requirements:**
- Email must be unique (not already registered)
- Password must be at least 6 characters
- Name can include spaces (use quotes)

---

### 2. Promote Existing User (make-admin.ts)
Promotes an existing user to admin role.

**Command:**
```bash
npx tsx scripts/make-admin.ts <email>
```

**Examples:**
```bash
npx tsx scripts/make-admin.ts user@example.com
npx tsx scripts/make-admin.ts 20253807@std.neu.edu.tr
```

**What it does:**
- ✅ Finds existing user by email
- ✅ Changes role from "user" to "admin"

**Requirements:**
- User must already exist in database

---

## 🚀 Quick Start

### First Time Setup (Create Admin)
```bash
# Navigate to project root
cd neu

# Create your first admin
npx tsx scripts/create-admin.ts your-email@example.com YourPassword123 "Your Name"

# Log in at http://localhost:3000/login
```

### Promote Existing User
```bash
# If you already have an account
npx tsx scripts/make-admin.ts your-email@example.com
```

---

## 📝 Notes

- Both scripts require the database to be running
- Admin users have access to:
  - Admin panel at `/admin`
  - User management
  - API usage statistics
  - System monitoring

- Regular users can be promoted to admin at any time
- Admin role can be revoked by changing role back to "user" in Prisma Studio

---

## 🔒 Security

- Passwords are hashed using bcrypt (10 rounds)
- Never commit passwords to version control
- Use strong passwords for admin accounts
- Regularly audit admin user list

---

## 🛠️ Troubleshooting

**"User already exists"**
- Use `make-admin.ts` instead to promote existing user

**"User not found"**
- Check email spelling
- Verify user exists in database (use Prisma Studio)

**"Command not found: tsx"**
- Install tsx: `npm install -D tsx`
- Or use: `npx tsx` (will auto-install)

---

## 📚 Related

- Prisma Studio: `npx prisma studio` (visual database editor)
- Database migrations: `npx prisma migrate dev`
- Generate Prisma Client: `npx prisma generate`
