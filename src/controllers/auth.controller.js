import logger from '#config/logger.js';
import { signupSchema } from '#validations/auth.validation.js';
import { formatvalidationErrors } from '#utils/format.js';
import { createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import { verifyUser } from '#services/auth.service.js';
import { signInSchema } from '#validations/auth.validation.js';



export const signup = async (req, res, next) => { 
    try{
        // signup logic here
        const validationResult = signupSchema.safeParse(req.body);
if (!validationResult.success) {
  return res.status(400).json({
    error: 'validation failed',
    details: formatvalidationErrors(validationResult.error)
  }); 
} 

        const { name ,email, password, role} = validationResult.data;
        const user  = await createUser({ name, email, password, role });
        const token = jwttoken.sign({ id : user.id , email : user.email , role: user.role });

        cookies.set(res, 'token' , token);
        // AUTH SERVICE    
        logger.info(`User signed up: ${email}`);
        res.status(201).json({
            message: 'User signed up successfully',
             user: { 
                id: user.id , name : user.name , email: user.email , role : user.role

              }
        });
    } catch (e){
        logger.error('Signup errror: ', e);

        if(e.message == 'User with this email already exists'){
            return res.status(409).json({ error: 'Email already exist'});
        }
        next(e);
    }
};
export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'validation failed', details: formatvalidationErrors(validationResult.error) });
    }

    const { email, password } = validationResult.data;
    const user = await verifyUser({ email, password });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });
    cookies.set(res, 'token', token);

    logger.info(`User signed in: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    logger.error('Signin error:', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

export const signout = (req, res) => {
  cookies.clear(res, 'token');
  logger.info('User signed out');
  res.status(200).json({ message: 'User signed out successfully' });
};
