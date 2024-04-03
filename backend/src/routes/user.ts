import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from '@prisma/client/edge';
import {Hono} from 'hono';
import {sign} from 'hono/jwt';
import {middleware} from '../middleware/verifyToken'
export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        userId:string,
        id:string
    }
}>();

userRouter.post('/update/:id',middleware,async (c)=>{
    const userId=c.get('userId');
    console.log(userId);
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const id= await c.req.param('id');
    const body=await c.req.json();
    if(userId!=id){
        c.status(401)
        return c.json({message:"you can update your own account"})
    }
    try{
        console.log('start')
        const updatedUser=await prisma.user.update({
            where: {
               id:parseInt(id)
            },
            data:{
                username:body.username,
                email:body.email,
                password:body.password,
                avatar:body.avatar
            }
        })
        console.log('end')
        c.status(200)
       return c.json({user:updatedUser})
    }
    catch(e){
        console.log(e)
        return c.json({message:"unable to update"});
    }
})

userRouter.delete('/delete/:id',middleware,async (c)=>{
    const userId=c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const id= await c.req.param('id');
    
    if(userId!=id){
        c.status(401)
        return c.json({message:"you can delete your own account"})
    }
    try{
       const deletedUser= await prisma.user.delete({
            where:{
                id:parseInt(id)
            }
        });
        console.log(deletedUser);
        c.status(200)
        return c.json({message:"user deleted"})
    }catch(e){
        c.status(401)
        return c.json({message:"error in deleting"});
    }

})
userRouter.get('/listings/:id',middleware,async (c)=>{
    const userId=c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const id= await c.req.param('id');
    
    if(userId!=id){
        c.status(401)
        return c.json({message:"you can delete your own account"})
    }
    try{
        const listings=await prisma.listing.findMany({
            where:{
                useRef:parseInt(id)
            }
        })
        c.status(200)
        return c.json({listings: listings});
    } catch(e){
        console.log(e);
        c.status(401)
        return c.json({message:"error getting userListing"})      
      }
})

userRouter.get('/:id',middleware,async(c)=>{
    const userId=c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const id= await c.req.param('id');
    try{
        const user=await prisma.user.findUnique({
            where:{
                id:parseInt(id)
            }
        })
        console.log(user)
        c.status(200);
       return c.json({user:user})
    }catch(err){
        console.log(err)
        c.status(500)
       return c.json({message:"error"})
    }
    
})git