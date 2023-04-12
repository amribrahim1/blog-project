// display (retrieve) blogs and its comments from firebase database and storage
database = firebase.database();
var database = firebase.database();    
database.ref('Blogs/').orderByChild('dateFull').on('value', function(snapshot) {
    var content = '';
    snapshot.forEach(function(data){                      
        var val = data.val();
        content += `<div class="card mb-4">
                        <img class="card-img-top" src="${val.ImageUrl}" title="${val.Title}" alt="${val.Title}">
                        <div class="card-body">
                            <h2 class="card-title">${val.Title}</h2>
                            <div class="card-text">${val.Description}</div>
                            <a class="btn btn-primary" href="/blog/${val.id}-${val.Title}">Read More &rarr;</a>
                        </div>
                        <div class="card-footer text-muted">Posted on ${val.date}</div>
                    </div><hr>`;                                        
    });            
    $('#ex-list').html(content);          
});
// ---------------------------------------------------------------------- //

// add comments under all the blogs and display them.    		
var database = firebase.database();
		
//create a variable to hold our orders list from firebase
var firebaseOrdersCollection = database.ref().child('BlogComments');

//this function is called when the add button is clicked
function submitSuggestion() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
              if (document.getElementById('Comment').value.length == 0) {
                return false,
                console.log('Write some thing'),
                document.getElementById('writeComment').style.display = "block";
              }
            //Grab order data from the form
            var order = {
                fullName: user.displayName,
                notes: $('#Comment').val(),
                uid: user.uid, 
            };
    
            //'push' (aka add) your order to the existing list
            firebaseOrdersCollection.push(order); //'orders' is the name of the 'collection' (aka database table)
            $('#Suggestions')[0].reset();
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
