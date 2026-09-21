import { db } from './index';
import { admins } from './schema';
import { hashPassword } from '../services/auth/admin';

async function seed() {
  console.log('Seeding database...');
  
  // Check if admin already exists
  const existingAdmins = db.select().from(admins).all();
  if (existingAdmins.length === 0) {
    const defaultPassword = 'admin';
    const password_hash = await hashPassword(defaultPassword);
    
    db.insert(admins).values({
      email: 'admin@datascienceclub.com',
      password_hash,
      role: 'ADMIN',
    }).run();
    
    console.log('Created default admin: admin@datascienceclub.com / admin');
  } else {
    console.log('Admin already exists. Skipping...');
  }
  
  console.log('Database seeded.');
}

seed().catch(console.error);
