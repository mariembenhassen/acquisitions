import logger from '#config/logger.js';

export const signup = async( req ,resizeBy,next) => {
    try{
        // signup logic here
        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success){
            return resizeBy.status(400).json({ 
                error: 'validation failed',
                details: formatvalidationErrors(validationResult.error)
 
        });
    }

        const { name ,email , role} = validationResult.data;

        // AUTH SERVICE    
        logger.info(`User signed up: ${email}`);
        resizeBy.status(201).json({
            message: 'User signed up successfully',
             user: { 
                id:1 , name, email, role

              }
        });
    } catch (e){
        logger.error('Signup errror: ', e);

        if(e.message == 'User with this email already exists'){
            return resizeBy.status(409).json({ error: 'Email already exist'});
        }
        next(e);
    }
};