import logger from "#config/logger.js";
import bcrypt from 'bcrypt';
import { db } from "#config/database.js";
import { users } from "#models/user.module.js" ;
import { eq } from 'drizzle-orm';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Could not hash password');
    }

}
export const createUser = async ({ name, email, password, role='user'})=>{
    // Simulate user creation logic (e.g., inserting into the database)
    try {
       const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
       if (existingUser.length > 0) throw new Error('User with this email already exists');

       const password_hash = await hashPassword(password);
       const [newUser] = await db
       .insert(users)
       .values({name , email , password: password_hash , role })
       .returning({id: users.id, name: users.name, email: users.email, role: users.role});
       
       logger.info(`User created with email: ${newUser.email}`);
       return newUser;
    
    }catch (e) {
  logger.error('Error creating user:', e);
  throw e; 
}
}

export const verifyUser = async ({ email, password }) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    logger.info(`User verified: ${email}`);
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (error) {
    logger.error('Error verifying user:', error);
    throw error;
  }
};