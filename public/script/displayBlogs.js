// display (retrieve) blogs and its comments from firebase database and storage
database = firebase.database();
var database = firebase.database();    
database.ref('Blogs/').orderByChild('dateFull').on('value', function(snapshot) {
    var content = '';
    snapshot.forEach(function(data){                      
        var val = data.val();
        var blogID = val.id;
        content += `<div class="card mb-4">
                        <div class="card-footer text-muted">Posted on ${val.date}</div>
                        <img src=${val.ImageUrl} class="card-img-top">
                        <div class="card-body" id="module">
                            <h2 class="card-title">${val.Title}</h2>
                            <p class="card-text collapse" id="collapseExample" aria-expanded="false">${val.Description}</p>
                            <a role="button" class="collapsed btn btn-primary" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a>
                        </div>
                        <div class="card my-4">
                            <h5 class="card-header">Leave a Comment:</h5>
                            <div class="card-body">
                                <form id="${blogID}fo" class="card my-4">
                                    <div class="form-group">
                                        <input class="form-control" id="${blogID}n" type="text" placeholder="Your Name" required>
                                        <p style="color:red;display:none;max-width: 100%;" class="alert alert-danger" id="${blogID}name">&#9888; Enter your name</p>
                                    </div>
                                    <div class="form-group">
                                        <textarea class="form-control" rows="3" id="${blogID}o" placeholder="Your Comment" required></textarea>
                                        <p style="color:red;display: none;max-width: 100%;" class="alert alert-danger" id="${blogID}comment">&#9888; Write some thing</p>
                                    </div>
                                    <a id="add-comment" class="btn btn-primary" onclick="submitComment(${blogID})">add comment</a>
                                </form>
                            </div>
                        </div>
                        <div id="${blogID}c"></div>
                    </div><hr><br>`;
                                                               
        firebase.database().ref(`comments/${blogID}/`).on('value',function(comments){
            var content = "";
            comments.forEach(function(firebaseCommentReference){
                var comment = firebaseCommentReference.val();                         
                content += `<div class="comment"><i class="fas fa-comments"></i><h5>${comment.Name}</h5><p>${comment.notes}</p></div>`;
                
            });
            $(`#${blogID}c`).html(content);
        });
    });            
    $('#ex-list').html(content);          
});


    // ---------------------------------------------------------------------- //

// add a comment for each blog only and display it under its blog
function submitComment(blogID) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (document.getElementById(`${blogID}n`).value.length == 0) {
                return false,
                console.log('Write your name'),
                document.getElementById(`${blogID}name`).style.display = "block",
                document.getElementById(`${blogID}comment`).style.display = "none";
            } 
            if (document.getElementById(`${blogID}o`).value.length == 0) {
                return false,
                console.log('Write some thing'),
                document.getElementById(`${blogID}name`).style.display = "none",
                document.getElementById(`${blogID}comment`).style.display = "block";
            } 
            var firebaseOrders = database.ref().child('comments/'+ blogID +'/');
            //Grab order data from the form
            var comment = {
                Name: $('#'+blogID+'n').val(),
                notes: $('#'+blogID+'o').val(), //another way you could write is $('#myForm [name="fullname"]').
            };
                            
            //'push' (aka add) your order to the existing list
            firebaseOrders.push(comment); //'orders' is the name of the 'collection' (aka database table)
            $('#'+blogID+'fo')[0].reset();
            document.getElementById(''+blogID+'name').style.display = "none";
            document.getElementById(''+blogID+'comment').style.display = "none";
        } 
        else {
            var messege = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: 'You must sign-in first',
                actionHandler: function() {
                    var modal = document.getElementById("myModal");
                    modal.style.display = "block";
                },
                actionText: 'Sign-in',
                timeout: 3000,
              };
              messege.MaterialSnackbar.showSnackbar(data);
              return { error: 'Sign in first ?!' };
        }
    });
};
// -------------------------------------------------------------------------- //
// add comments under all the blogs and display them.    		
var database = firebase.database();
		
//create a variable to hold our orders list from firebase
var firebaseOrdersCollection = database.ref().child('BlogComments');

//this function is called when the add button is clicked
function submitSuggestion() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (document.getElementById('Name').value.length == 0) {
                return false,
                console.log('Write your name'),
                document.getElementById('writeName').style.display = "block",
                document.getElementById('writeComment').style.display = "none";
              } 
              if (document.getElementById('Comment').value.length == 0) {
                return false,
                console.log('Write some thing'),
                document.getElementById('writeComment').style.display = "block",
                document.getElementById('writeName').style.display = "none";
              }
            //Grab order data from the form
            var order = {
                fullName: $('#Name').val(), //another way you could write is $('#myForm [name="fullname"]').
                notes: $('#Comment').val(), //another way you could write is $('#myForm [name="fullname"]').
            };
    
            //'push' (aka add) your order to the existing list
            firebaseOrdersCollection.push(order); //'orders' is the name of the 'collection' (aka database table)
            $('#Suggestions')[0].reset();
            document.getElementById('writeName').style.display = "none";
            document.getElementById('writeComment').style.display = "none";
    
        } else {
            var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: 'You must sign-in first',
                actionHandler: function() {
                    var modal = document.getElementById("myModal");
                    modal.style.display = "block";
                },
                actionText: 'Sign-in',
                timeout: 3000,
              };
              notification.MaterialSnackbar.showSnackbar(data);
              return { error: 'Sign in first ?!' };
        }
    })
};

//create a 'listener' which waits for changes to the values inside the firebaseOrdersCollection 
firebaseOrdersCollection.on('value',function(orders){
    
    //create an empty string that will hold our new HTML
    var allOrdersHtml = "";
    
    //this is saying foreach order do the following function...
    orders.forEach(function(firebaseOrderReference){
        
        //this gets the actual data (JSON) for the order.
        var order = firebaseOrderReference.val();
        
        //create html for the individual order
        //note: this is hard to make look pretty! Be sure to keep your indents nice :-)
        //IMPORTANT: we use ` here instead of ' (notice the difference?) That allows us to use enters
        var individialOrderHtml =	`<div class='item'><i class="fas fa-comments"></i>
                                        <h6>`+order.fullName+`</h6>
                                        <p>`+order.notes+`</p><hr>
                                    </div>`;
        
        //add the individual order html to the end of the allOrdersHtml list
        allOrdersHtml = allOrdersHtml + individialOrderHtml;
    });
    
    //actaull put the html on the page inside the element with the id PreviousOrders
    $('#previousComments').html(allOrdersHtml);
    
    //note: an alternative approach would be to create a hidden html element for one order on the page, duplicate it in the forEach loop, unhide it, and replace the information, and add it back. 
});

// -----------------------------------------------------------------------------------------//