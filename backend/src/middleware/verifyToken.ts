import {verify} from 'hono/jwt'
import {Hono} from 'hono';


export const middleware=async (c,next)=>{
    const jwt=c.req.header('Authorization');
    console.log(jwt);
    if(!jwt){
      c.status(401);
      return c.json({error:"unauthorized"});
    }
    const token=jwt.split(' ')[1];
    const payload=await verify(token,c.env.JWT_SECRET);
    if(!payload){
      c.status(401);
      return c.json({error:"unauthorized"});
    }
    c.set('userId',payload.id);
    await next();
} 