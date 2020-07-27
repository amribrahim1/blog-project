// Reference Users collection
var databaseRef = firebase.database().ref('Blogs');
database.ref('Blogs/').limitToLast(1).on('value', function(snapshot){
  snapshot.forEach(function(data){
    var val = data.val();
    var blogID = val.id;
    document.getElementById('id').value = (blogID*1+1);
    
  })
})

var databaseRef = firebase.database().ref('Blogs');
database.ref('Blogs/').on('value', function(snapshot){
  var allIDHtml = "";
  snapshot.forEach(function(data){
    var val = data.val();
    var blogID = val.id;
    var individialIDHtml = `<option>${blogID}</option>`   
    allIDHtml = allIDHtml + individialIDHtml;                    
  })
  $('#selectID').html('<option value="" selected value>ID</option>'+allIDHtml);
})

function report () {
  if (document.getElementById('selectID').value === "") {
    document.getElementById('careful').style.display = "none";
  } else {document.getElementById('careful').style.display = "block";}
}
// Add a blog
// Listen for form submit
document.forms.AddForm.addEventListener('submit', submitForm);

// Submit form
function submitForm(e) {
    e.preventDefault();
    // Get values
    $('textarea[name=Description]').val(function(index, value) {
      return value.replace('\n', '<br>');
   });
    var Description = document.getElementById('Description').value;
    if (document.getElementById('selectID').value === "") {
      id = document.getElementById('id').value;
    } else {
      var result = confirm("Are you sure you want to replace this blog?");
      if (result) {
      id = document.getElementById('selectID').value;
      }
    }
    
    var Title = document.getElementById('title').value;
    var imageFile = document.getElementById('img').files[0];

    //this VAR's are used in 'saveBlog()'; function. ---NOT IN USE---
    // unused value=5;  if false value=0; if true value=1
    var isSavedDatabase = false; //  if user data successfully commited to Firebase Database.
    var isSavedImage = false; //  if user image successfully commited to Firebase Storage.

    // Save User
    saveBlog(Title, Description, id, imageFile);
    document.getElementById("addBlog").reset();
}
// Save User to firebase
function saveBlog(Title, Description, id, imageFile) {
  // Upload file to the object 'passportImages/id1' (id1 is current user ID)
  var uploadTask = firebase.storage().ref().child('blogImages/' + id).put(imageFile);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function (snapshot) {
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                          console.log('Upload is paused');
                          break;
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                          console.log('Upload is running');
                          break;
                  }
                  firebase.storage().ref().child('blogImages/' + id).getDownloadURL().then(function(url) {                 
                    // Inserted into an <img> element:
                    saveData(Description,Title, id, url);
                  })
              }, function (error) {
                  databaseRef.child(id).remove(); //remove user info from database if his image could not be uploaded to storage too.
                  console.log(error);
                  window.alert(`Something went wrong, please try again. ${error.message}`);
  
                  // A full list of error codes is available at
                  // https://firebase.google.com/docs/storage/web/handle-errors
                  switch (error.code) {
                      case 'storage/unauthorized':
                          // User doesn't have permission to access the object
                          console.log("Image: User doesn't have permission to access the object");
                          break;
  
                      case 'storage/canceled':
                          // User canceled the upload
                          console.log("Image: User canceled the upload");
                          break;
  
                      case 'storage/unknown':
                          // Unknown error occurred, inspect error.serverResponse
                          console.log("Image: Unknown error occurred, inspect error.serverResponse");
                          break;
                  }
                  
              }, function () {
                  // Upload completed successfully!
                  isSavedImage = true;
                  console.log("Image uploaded successfully!");
                  
              });
          //if all data commited successfully to Firebase pop a massage and reset form.
          
     
    // reference to image path in storage 'passportImages/id1' (id1 is current user ID)
    function saveData(Description,Title, id, url) {
    //save User to database
    var newUserRef = databaseRef;
    newUserRef.push({
        Description: Description,
        Title: Title,
        id: id,
        ImageUrl: url,
        date: (new Date().toLocaleString('default', { month: 'long' })) + " " + new Date().getDate()+ ", " +  new Date().getFullYear(),
        dateFull: (id*-1),
    }, function (error) {
        if (error) {
            // The write failed
            console.log("Blog could not be added: " + error);
        } else {
            // Data saved successfully!
            isSavedDatabase = true;
            console.log("Blog added successfully!");
        }
    });
    finalCall(id, Title);
  }
  function finalCall(id, Title) {
    postData('/add', { id: id, title: Title })
    // Function to POST data
  }
}
const postData = async (url = '', data = {}) => {
  console.log(data);
  const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
  });
  try {
      const newData = await response.json();
      return newData;
  }
  catch (error) {
      console.log("Error in PostData", error);
  }
}