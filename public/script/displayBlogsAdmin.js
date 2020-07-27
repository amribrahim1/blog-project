var database = firebase.database();
database.ref('Blogs/').orderByChild('dateFull').on('value', function(snapshot){
    var allBlogsHtml = "";  
    snapshot.forEach(function(data){
        var childKey = data.key;
        var val = data.val();
        var blogID = val.id;
        var blogTitle = val.Title;
        
        var individialBlogHtml = `<img src=${val.ImageUrl} style="width:90%">
                                <div>TITLE:<h2>${val.Title}</h2><a class="btn btn-warning" onClick="editTitle(${blogID})">edit title</a></div><br>
                                <div id="dialog${blogID}editTitle" style="display:none" title="Edit blog title">
                                    <input type="text" id="newTitle${blogID}" value="${val.Title}">
                                </div>
                                <div><p>${val.Description}</p><a id="editTitle${blogID}" class="btn btn-warning" onClick="editDescription(${blogID})">edit description</a></div><br>
                                <div id="dialog${blogID}editDescription" style="display:none" title="Edit blog description">
                                    <textarea type="text" id="newDescription${blogID}">${val.Description}</textarea>
                                </div>
                                <dev>ID:&nbsp;&nbsp;&nbsp;${val.id}</dev><br>
                                Posted on `+ val.date + `
                                <a class="btn btn-danger" onClick="delete_blog(\`${childKey}\`,${blogID},'${blogTitle}')">delete blog</a><br>
                                <div id="dialog${blogID}deleteBlog" style="display:none" title="Delete this blog?">
                                    <p style="color:blue">This blog and its comments will be permanently deleted and cannot be recovered. Are you sure?</p><br>
                                    ${val.Title}
                                </div>
                                <h2>Comments</h2><br>
                                <table class="table table-bordered" id="${blogID}c"><tr><th>Name</th><th>Comment</th><th>Delete</th></tr></table>
                                <br><hr><br>`;
                 
        firebase.database().ref(`comments/${blogID}/`).on('value',function(comments){
            var allCommentsHtml = "";
            comments.forEach(function(firebaseCommentReference){
                var comment = firebaseCommentReference.val();
                var Key =  firebaseCommentReference.key;                        
                var individialCommentHtml = `<tr><td style="width:22%">${comment.Name}</td>
                                            <td>${comment.notes}</td>
                                            <td style="width:22%"><a class="btn btn-warning" onClick="delete_comment(\`${Key}\`,${blogID})">delete comment</a></td>
                                            <td id="dialog${blogID}deleteComment" style="display:none;word-break: break-word;width:auto;" title="Delete this comment?">
                                                <p style="color:blue">Are you sure you want to delete this comment?</p><br>
                                                ${comment.Name}<br>${comment.notes}
                                            </td>
                                            <tr>`;
                allCommentsHtml = allCommentsHtml + individialCommentHtml;
            });
            $('#'+blogID+'c').html('<tr><th>Name</th><th>Comment</th><th>Delete</th></tr>'+allCommentsHtml);
        });
        allBlogsHtml = allBlogsHtml + individialBlogHtml;
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          user.getIdTokenResult().then(idTokenResult => { 
            if (idTokenResult.claims.admin === true) {
                $('#ex-list').html(allBlogsHtml);
            } 
          })
        } 
    });    
});

// delete a blog and its comments
/* function delete_blog(childKey,blogID){
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        firebase.storage().ref().child(`blogImages/${blogID}`).delete();
        firebase.database().ref().child(`Blogs/${childKey}/`).remove();
        firebase.database().ref().child(`comments/${childKey}/`).remove();
    }
} */
function delete_blog(childKey,blogID,blogTitle){
    $(`#dialog${blogID}deleteBlog`).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete": function() {
                firebase.storage().ref().child(`blogImages/${blogID}`).delete();
                firebase.database().ref().child(`Blogs/${childKey}/`).remove();
                firebase.database().ref().child(`comments/${childKey}/`).remove();
                deleteData('/delete', { id: blogID, title: blogTitle})
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });
}
const deleteData = async (url = '', data = {}) => {
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

// delete a comment
/*
function delete_comment(Key,blogID){
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        firebase.database().ref().child(`comments/${blogID}/${Key}/`).remove();
    }
}   */
function delete_comment(Key,blogID){
    $(`#dialog${blogID}deleteComment`).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete": function() {
                firebase.database().ref().child(`comments/${blogID}/${Key}/`).remove();
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

// edit blog title
function editTitle(blogID) {
    $(`#dialog${blogID}editTitle`).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Save changs": function() {
            firebase.database().ref('Blogs').orderByChild("id").equalTo(`${blogID}`).on("child_added", function(snapshot) {
                const newTitle = document.querySelector(`#newTitle${blogID}`);
                snapshot.ref.update({ Title: newTitle.value })
            })
            $( this ).dialog( "close" );
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
        }
      });
}

// Edit blog description
function editDescription(blogID) {
    $(`#dialog${blogID}editDescription`).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Save changs": function() {
                firebase.database().ref('Blogs').orderByChild("id").equalTo(`${blogID}`).on("child_added", function(snapshot) {
                    const newDescription = document.querySelector(`#newDescription${blogID}`);
                    snapshot.ref.update({ Description: newDescription.value })
                })
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            },
        }
    });
}
/*
function editTitle(blogID) {
    const title = document.querySelector(`#title${blogID}`);
    const editTitleButton = document.querySelector(`#editTitle${blogID}`);
    firebase.database().ref('Blogs').orderByChild("id").equalTo(`${blogID}`).on("child_added", function(snapshot) {
        var titleValue = snapshot.val().Title;
        title.innerHTML = `<input type="text" id="newTitle${blogID}" value="${titleValue}">`;
        editTitleButton.innerHTML = `<a class="btn-item" onClick="OKEditTitle(${blogID})">OK</a>`+`&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`+`<a class="btn-item" onClick="CancelEditTitle(${blogID})">Cancel</a>`
        console.log(title);
        // &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<a class="btn-item" onClick="CancelEditTitle(${blogID})">Cancel</a>
    });
}
*/