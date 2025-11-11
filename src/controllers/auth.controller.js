import logger from '#config/logger.js';
import { signupSchema } from '#validations/auth.validation.js';
import { formatvalidationErrors } from '#utils/format.js';

export const signup = async (req, res, next) => { 
    try{
        // signup logic here
        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({ 
                error: 'validation failed',
                details: formatvalidationErrors(validationResult.error)
 
        });
    }

        const { name ,email , role} = validationResult.data;

        // AUTH SERVICE    
        logger.info(`User signed up: ${email}`);
        res.status(201).json({
            message: 'User signed up successfully',
             user: { 
                id:1 , name, email, role

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