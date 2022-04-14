// Server .js will listen the incoming request

let express=require('express')  // install the express
let {MongoClient, ObjectId}=require('mongodb') // Access MongoClient from mongodb Packages
  
                /* npm init -y (enter)  (create a new file package.json in TODO-APP folder)
                    npm install express (enter) (install express pacake in TODO-APP folder)
                            node_modules (store express files)
                            package.json has everything that is necessary

                */

let sanitizeHTML=require('sanitize-html')
let app =express()
let db


let port =process.env.PORT
if(port == null || port == ""){
  port =3000
}

app.use(express.static('public'))

async function go()
{
    let client= new MongoClient('mongodb+srv://todoAppUser:Todoappuser123@cluster0.k41pq.mongodb.net/TodoApp?retryWrites=true&w=majority')
    await client.connect()
    db=client.db()
    app.listen(port)
}
go()


// Add the form values in body object to the request object

app.use(express.json())
app.use(express.urlencoded({extended: false}))

function passwordProtected(request,response,next){
  response.set('WWW-Authenticate','Basic realm="Simple Todo App"')
  console.log(request.headers.authorization)
  if(request.headers.authorization == 'Basic bGVhcm46amF2YXNjcmlwdA=='){
    next()
  }else{
    response.status(401).send("Authentication required")

  }

}
app.use(passwordProtected)

app.get('/'  ,function(request , response){ // get request to home Page
   db.collection('items').find().toArray(function(error,items){
    response.send(`
   
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App </title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1" > To-Do App !!! </h1>
      <div class ="jumbotron p-3 shawdow-sm">
        <form id="create-form" action="/create-item" method="POST">
          <div class ="d-flex align-items-center">
            <input id="create-field" name="item" autofocus autocomplete="off" class ="form-control mr-3" type="text" style="flex: 1;">
            
            <button class="btn btn-primary"> Add New Item </button>     
          </div>    
          </form>        
      </div>
      
      <ul id="item-list" class="list-group pb-5">
      ${items.map(function(item){
      
        return `<li class ="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${item._id}"class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`
      } ).join('')}
     
         
      
      </ul> 
    
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script> 
      <script src="/browser.js"></script>   
  </body>
</html>  `)
   })
})


app.post('/create-item',function(request,response)
{
   // console.log (request.body.item) --> The value we want to save in a dataBase
   let safeText=sanitizeHTML(request.body.text ,{allowedTags:[],allowedAttributes :{}})
   db.collection('items').insertOne({text:safeText},function(error,info) {
    response.json({_id: info.insertId, text:safeText})

   })  
})
app.post('/update-item',function(request,response){
  //wanted to communicate with mongodb database
  let safeText=sanitizeHTML(request.body.text ,{allowedTags:[],allowedAttributes :{}})
  db.collection('items').findOneAndUpdate({_id: new ObjectId(request.body.id)},{$set:{text:safeText}},function(){
    response.send("Success")
  })
  
})
app.post('/delete-item',function(request,response){
  db.collection('items').deleteOne({_id: new ObjectId(request.body.id)},function(){
    response.send("Success")
  })
})


