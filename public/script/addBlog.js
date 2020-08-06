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
   var addBlogContent = tinymce.get("add-blog-textarea").getContent();
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
    saveBlog(Title, addBlogContent, id, imageFile);
    document.getElementById("addBlog").reset();
}
// Save User to firebase
function saveBlog(Title, addBlogContent, id, imageFile) {
  // Upload file to the object 'blogImages/id' (id1 is current user ID)
  firebase.storage().ref().child('blogImages/' + id).put(imageFile).snapshot.ref.getDownloadURL().then(function(url) {
    console.log('File available at', url);
    saveData(addBlogContent,Title, id, url);
  }, function(error) {
    if (error) {
      console.log("Image could not be uploaded: " + error.code+ ".Try reload the page and try again");
      var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: `Image could not be uploaded:${error.code}.Try reload the page and try again`,
                timeout: 5000,
              };
              notification.MaterialSnackbar.showSnackbar(data);
      return false;
    }
  });
 
    function saveData(addBlogContent,Title, id, url) {
    //save User to database
    var newUserRef = databaseRef;
    newUserRef.push({
        Description: addBlogContent,
        Title: Title,
        id: id,
        ImageUrl: url,
        date: (new Date().toLocaleString('default', { month: 'long' })) + " " + new Date().getDate()+ ", " +  new Date().getFullYear(),
        dateFull: (id*-1),
    }, function (error) {
        if (error) {
            // The write failed
            console.log("Blog could not be added: " + error);
            var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: `Blog could not be added: ${error}`,
                timeout: 5000,
              };
              notification.MaterialSnackbar.showSnackbar(data);
            return false;
        } else {
            // Data saved successfully!
            isSavedDatabase = true;
            console.log("Blog added successfully!");
            savePage(id, Title);
        }
    });
    
  }
  function savePage(id, Title) {
    // Function to POST data
    postData('/add', { id: id, title: Title });
    finalCall();
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
      var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: `Error in PostData: ${error}`,
                timeout: 5000,
              };
              notification.MaterialSnackbar.showSnackbar(data);
    }
  }
  function finalCall() {
    // Show alert
    var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: 'Blog has been added successfully!',
                timeout: 3000,
              };
              notification.MaterialSnackbar.showSnackbar(data);
    // Clear form
    document.forms.AddForm.reset();
  }
}

// TinyMCE Editor textarea
$(document).ready(function () {
  tinymce.init({
    selector: "#add-blog-textarea",
    height : 400,
    max_height: 400,
    paste_data_images: true,
    plugins: [
      "advlist autolink lists link image charmap print preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars code fullscreen",
      "insertdatetime media nonbreaking save table directionality",
      "emoticons template paste formatpainter "
    ],
    toolbar1: "undo redo | fontselect fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | forecolor backcolor formatpainter | bullist numlist outdent indent | link image media | emoticons | preview",
    image_advtab: true,
    image_title: true,
    file_picker_callback: function(callback, value, meta) {
      if (meta.filetype == 'image') {
        $('#upload').trigger('click');
        $('#upload').on('change', function() {
          var file = this.files[0];
          firebase.storage().ref().child(`blogs/${file.name}`).put(file).snapshot.ref.getDownloadURL().then(function(url) {
    console.log('File available at', url);
    callback(url, {alt: file.name}, {title: file.name});
  }, function(error) {
    if (error) {
      console.log("Image could not be uploaded: " + error.code+ ".Try reload the page and try again");
      return false;
    }
  });
        });
      }
    },
  image_caption: true,
  });
});
