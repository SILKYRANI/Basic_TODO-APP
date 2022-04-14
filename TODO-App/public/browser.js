function itemTemplate(item)
{
    return `<li class ="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}"class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}






// CREATE FEATURES
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit",function(e){  //submit will take of click submit on page or press enter button
    e.preventDefault()
    axios.post('/create-item',{text: createField.value}).then(function(response){
       // Create the HTML for a new Item
      document.getElementById("item-list").insertAdjacentElement("beforeend",itemTemplate(response.data))
      createField.value="" 
      createField.focus()
    }).catch(function(){
          console.log("Please try again later")
      })

})

document.addEventListener("click",function(e){ // e for edit event and responsible for talking to html
    
    // DELETE FEATURES
    if(e.target.classList.contains("delete-me")){
        if(confirm("do you want to delete")){
            axios.post('/delete-item',{id: e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.remove()
              }).catch(function(){
                  console.log("Please try again later")
              })

        }

    }
    
    
    
    // UPDATE FEATURES ie EDIT
    if(e.target.classList.contains("edit-me")){
        let userInput = prompt("Edit the old text" , e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
       if(userInput){
        axios.post('/update-item',{text: userInput , id: e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML =userInput
          }).catch(function(){
              console.log("Please try again later")
          })
       } 
    }
 } )