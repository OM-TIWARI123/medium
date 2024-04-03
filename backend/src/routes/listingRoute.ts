import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from '@prisma/client/edge';
import {Hono} from 'hono';
import {sign} from 'hono/jwt';
import {middleware} from '../middleware/verifyToken'
import { Listing } from '@prisma/client'; 

export const listingRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        userId:string,
        limit:number,
        startIndex:number,
        offer:boolean,
        furnished: boolean ,
        listings: Listing[],
        ordesort: string,
        searchTerm: string,
        type: string,
        parking: boolean 


    }
}>();

listingRouter.post('/create',middleware,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    try{
        const listing=await prisma.listing.create({
            data:{
                ...body
            }
        })
        c.status(201)
        console.log(listing);
        return c.json({listing:listing})
    }catch(e){
        console.log(e);
        return c.json({message:"error creating in listing"});
    }

})

listingRouter.delete('/delete/:id',middleware,async (c)=>{
    const userId=c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const id=await c.req.param('id');
    const listing = await prisma.listing.findUnique({
        where:{
            id:parseInt(id)
        }
    })
    if(!listing){
        c.status(404)
        return c.json({message:"listing not found"})
    }
    if(parseInt(userId)!=listing.useRef){
        c.status(401)
        return c.json({message:"you can delete ypur own listing"})
    }
    try{
        const deletedListing=await prisma.listing.delete({
            where:{
                id:parseInt(id)
            }
        })
        console.log(deletedListing)
        c.status(200)
        return c.json({message:"Listing has been deleted successfully"})
    }catch(e){
        console.log(e);
        c.status(500)
        return c.json({message:"Listing cant be deleted"})
    }
})

listingRouter.post('/update/:id',middleware,async (c)=>{
    const userId=c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const id=await c.req.param('id');
    const body=c.req.json();
    const listing=await prisma.listing.findUnique({
        where:{
            id:parseInt(id)
        }
    })
    if(!listing){
        c.status(404)
        return c.json({message:"listing not found"})
    }
    if(parseInt(userId)!=listing.useRef){
        c.status(401)
        return c.json({message:"you can delete ypur own listing"})
    }
    try{
        const updatedListing=await prisma.listing.update({
            where:{
                id:parseInt(id)
            },
            data:{
                ...body
            }
        })
        return c.json({listing:updatedListing})
    }catch(e){
        console.log(e)
        c.status(401)
        return c.json({message:"you can update your owmn listing"})
    }
})

listingRouter.get('/get', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
       const listings=await prisma.listing.findMany({

       });
       console.log(listings)
       c.status(200)
      return  c.json({listings: listings})
    } catch (error) {
        console.log("error")
        c.status(500)
        return c.json({message:"error"})
    }

    
})
listingRouter.get('/get/:id',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const id=await c.req.param('id')
    try{
        const listing=await prisma.listing.findUnique({
            where:{
                id:parseInt(id)
            }
        })
        console.log(listing);
        c.status(200)
        return c.json({listing:listing})

    }catch(err){
        console.log(err)
        c.status(500)
        return c.json({message:"error"})
    }
})