import { Hono } from 'hono'
import {authRouter} from './routes/auth'
import { userRouter } from './routes/user';
import {verify} from 'hono/jwt'
import { listingRouter } from './routes/listingRoute';
import { cors } from 'hono/cors'
export const app = new Hono<{
  Bindings:{ 
    DATABASE_URL:string,
    JWT_SECRET:string
  },
  Variables:{
    userId:string,
  }
}>();

app.use('/api/*',cors());
app.route('/api/auth',authRouter)
app.route('/api/user',userRouter)
app.route('/api/listing',listingRouter)

// app.post('/api/auth/signin',async (c) => {
//   const prisma = new PrismaClient({
// 		datasourceUrl: c.env?.DATABASE_URL	,
// 	}).$extends(withAccelerate());
//   const body= await c.req.json();
//   const user=await prisma.user.findUnique({
//     where:{
//       email: body.email,
//     }
//   });
//   if(!user){
//     c.status(403);
//     return c.json({error:"user not found"});
//   }
//   const jwt= await sign({id:user.id},c.env.JWT_SECRET);
//   return c.json({jwt});
// })

// app.post('/api/auth/google', (c) => {
//   return c.text('Hello Hono!')
// })

app.post('/api/auth/signout', (c) => {
  return c.text('Hello Hono!')
})

// app.post('/api/user/update/:id',(c)=>{

//   return c.text('Update');
// })

// app.delete('/api/user/delete/:id', (c)=>{
//   return c.text('Delete');
// })

//   

app.delete('api/listing/delete/:id',(c)=>{
  return c.text('createe');
})

app.post('api/listing/update/:id',(c)=>{
  return c.text('createe');
})

app.get('api/listing/get/:id',(c)=>{
  return c.text('createe');
})

app.get('api/listing/get',(c)=>{
  return c.text('createe');
})

export default app
