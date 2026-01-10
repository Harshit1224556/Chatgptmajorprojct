const app = require('./src/app')

const connecttoDb = require('./src/db/db')
connecttoDb()
app.listen(3000,()=>{
    console.log("Server is running at the port 3000")
})