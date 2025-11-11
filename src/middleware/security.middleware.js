import aj from '#config/arcjet.js';
import { slidingWindow } from '@arcjet/node';

//this methode define how many requests each role can be allowed to do
const securityMiddleware = async (req ,res, next) => {
    try {
        const role = req.user?.role || 'guest';
        let limit;
        let message;

        switch(role){
            case 'admin':
                limit = 20;
                message = 'admin request limit exceeded 20 per minutes. slow down !'
            break;
              case 'user':
                limit = 10;
                message = 'user request limit exceeded 10 per minutes. slow down !'
            break;  
            case 'guest':
                limit = 5;
                message = 'admin request limit exceeded 5 per minutes. slow down !'
            break;
            }

            const client = aj.withRule(slidingWindow ({ mode: 'LIVE', interval: '1m', max: limit , name: `${role}-rate-limit` }));
            const decision = await client.protect(req);
            if(decision.isDenied() && decision.reason.isBot()){ 
                logger.warn('Bot request blocked' , { ip: req.ip, userAgent: req.get('User-Agent'), path: req.path });
                return res.status(403).json({ error: 'Forbidden' ,message: 'Your request has been identified as coming from a bot and has been blocked.' });
            }
    }catch(e){
        console.error('Arcjet error: ', e);
         res.status(500).json({ error: 'Internal Server Error' });
    
    }}
