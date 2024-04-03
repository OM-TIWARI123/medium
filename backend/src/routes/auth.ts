import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from '@prisma/client/edge';
import {Hono} from 'hono';
import {sign} from 'hono/jwt';

export const authRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
}>();
authRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL,
      }).$extends(withAccelerate());
      const body = await c.req.json();
    try {
          const user = await prisma.user.create({
              data: {
                  username:body.username,
                  email: body.email,
                  password: body.password
              }
          });
      const jwt=await sign({id:user.id},c.env.JWT_SECRET);
          return c.json({token:jwt,user:user})
      } catch(e) {
      console.log(e);
          return c.status(403);
      }
  
  })

  authRouter.post('/signin',async (c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
    const body= await c.req.json();
    const user=await prisma.user.findUnique({
      where:{
        email: body.email,
        password: body.password
      }
    });
    if(!user){
      c.status(403);
      return c.json({error:"user not found"});
    }
    const jwt= await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({jwt,user});
  })

  authRouter.post('/google',(c) =>{
    return  c.json({message:"google"});
  })
  