// Display comments or Suggestions after all blogs and delete it
firebase.database().ref('BlogComments').on('value',function(orders){
	//create an empty string that will hold our new HTML
    var allOrdersHtml = "";    
    //this is saying foreach order do the following function...
    orders.forEach(function(firebaseOrderReference){
        var Keys = firebaseOrderReference.key;
        //this gets the actual data (JSON) for the order.
        var order = firebaseOrderReference.val();       
        //create html for the individual order
        //note: this is hard to make look pretty! Be sure to keep your indents nice :-)
        //IMPORTANT: we use ` here instead of ' (notice the difference?) That allows us to use enters
        var individialOrderHtml =	`<tr><td style="width:22%">${order.fullName}</td>
                                     <td>${order.notes}</td>
                                     <td style="width:22%"><a class="btn btn-warning" onclick="delete_sug(\`${Keys}\`)">delete comment</a></td>
                                     <td id="dialog${Keys}deleteSuggestion" style="display:none" title="Delete this comment?">
                                     <p style="color:blue">Are you sure you want to delete this comment?</p><br>
                                        ${order.fullName}<br>
                                        ${order.notes}
                                    </td>
                                   </tr>`;
        
        //add the individual order html to the end of the allOrdersHtml list
        allOrdersHtml = allOrdersHtml + individialOrderHtml;
    });    
    //actaull put the html on the page inside the element with the id PreviousOrders
    $('#co-table').html(allOrdersHtml);    
    //note: an alternative approach would be to create a hidden html element for one order on the page, duplicate it in the forEach loop, unhide it, and replace the information, and add it back. 
});

// delete a Suggest
/* function delete_sug(Keys){
    var result = confirm("Are you sure you want to delete?");
    if (result) {
            firebase.database().ref().child(`BlogComments/${Keys}`).remove();                       
    }
} */
function delete_sug(Keys){
    $(`#dialog${Keys}deleteSuggestion`).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Delete": function() {
            firebase.database().ref().child(`BlogComments/${Keys}`).remove(); 
            $( this ).dialog( "close" );
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
        }
      });
}