function users() {
listAllUsers({})
.then(function(result) {
  const users = result.data
  console.log(users);
  var allUsers = "";
  for (const user of users) { 
    var UID= user.uid;
    var admin,disable = "";
    if (user.disabled === false) {disable = `<a class="btn btn-default" onclick="disableUser('${UID}')">disable</a>`;}
    else if (user.disabled = true) {disable=`<a class="btn btn-warning" onclick="enableUser('${UID}')">enable</a>`;}
    if (user.customClaims) { 
      var updateUser = "";
      if (user.customClaims.owner === true) { admin = "owner"; updateUser,disable=""; }
      else if (user.customClaims.admin === true) { admin = "admin"; updateUser,disable=""; }
      else { 
        admin = "No"; 
        updateUser = `<a class="btn btn-info" onclick="updateUsers('${UID}')">upate user</a>`;
        
      }
    } else { 
      admin = "No";
      updateUser = `<a class="btn btn-info" onclick="updateUsers('${UID}')">upate user</a>`;
      
    }
      
         allUsers+= `<tr>
                      <td>${user.email}</td>
                      <td>${user.uid}</td>
                      <td>${user.displayName}</td>
                      <td>${user.emailVerified}</td>
                      <td>${admin}</td>
                      <td>${user.metadata.lastSignInTime}</td>
                      <td>${user.metadata.creationTime}</td>
                      <td>${updateUser}</td>
                      <td>${disable}</td>
                      <td id="dialog${UID}disable" style="display:none" title="Disable account?">
                        <div class="alert alert-danger" role="alert">
                          <span class="glyphicon glyphicon-alert"></span> Users with disabled accounts aren't able to sign in.
                        </div>
                        <p style="color:blue">Are you sure you want to disable this user?</p>
                        UID: ${user.uid}<br>E-mail: ${user.email}<br>Name: ${user.displayName}
                      </td>
                      <td id="dialog${UID}updateUser" style="display:none" title="Update User">
                          uid: ${UID}<br><br>
                          <label style="width:130px">Display Name </label><input type="text" id="newName${UID}" value="${user.displayName}"><br>
                          <label style="width:130px">Email </label><input type="text" id="newEmail${UID}" value="${user.email}">
                      </td>
                   </tr>`;
  }
     
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.admin === true || idTokenResult.claims.owner === true) {                   
          $('#usersTable').html(allUsers);
          return allUsers
        } 
      })
    } 
  });  
})
}
document.getElementById("usersTable").innerHTML = users() ;
function updateDiv() { 
  document.getElementById("usersTable").innerHTML = users() ;
}

const updateUser = functions.httpsCallable('updateUser');
 
function updateUsers(UID) {
$(`#dialog${UID}updateUser`).dialog({
  resizable: false,
  height: "auto",
  width: 400,
  modal: true,
  buttons: {
    "Save changs": function() {
      updateUser({ uid: UID, 
        email: $(`#newEmail${UID}`).val(),
        displayName: $(`#newName${UID}`).val(),
      })
      
      .then(function(result) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log(result);  
        var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: result.data.messege,
                timeout: 5000,
              };
              notification.MaterialSnackbar.showSnackbar(data);     
        if (result.data.error) {
          var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: result.data.error.errorInfo.message,
                timeout: 5000,
              };
              notification.MaterialSnackbar.showSnackbar(data);  
        }
      })
      $( this ).dialog( "close" )
    },
    Cancel: function() {
      $( this ).dialog( "close" );
    }
  }
});    
} 

function disableUser(UID) {
  $(`#dialog${UID}disable`).dialog({
      resizable: false,
      height: "auto",
      width: 500,
      modal: true,
      buttons: {
          "disable": function() {
            updateUser({ uid: UID, 
              disabled: true,
            })           
            .then(function(result) {
              // See the UserRecord reference doc for the contents of userRecord.
              console.log(result);  
              var notification = document.querySelector('.mdl-js-snackbar');
              var data = {
                  message: result.data.messege,
                  timeout: 5000,
                };
                notification.MaterialSnackbar.showSnackbar(data);          
              if (result.data.error) {
                var notification = document.querySelector('.mdl-js-snackbar');
                var data = {
                  message: result.data.error.errorInfo.message,
                  timeout: 5000,
                };
                notification.MaterialSnackbar.showSnackbar(data);  
              }
            })
            $( this ).dialog( "close" )
          },
          Cancel: function() {
              $( this ).dialog( "close" );
          }
      }
  });
}

function enableUser(UID) {
  updateUser({ uid: UID, 
    disabled: false,
  }).then(function(result) {
  // See the UserRecord reference doc for the contents of userRecord.
    console.log(result); 
    var notification = document.querySelector('.mdl-js-snackbar');
              var data = {
                  message: result.data.messege,
                  timeout: 5000,
                };
                notification.MaterialSnackbar.showSnackbar(data);                
    if (result.data.error) {
      var notification = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: result.data.error.errorInfo.message,
                timeout: 5000,
              };
              notification.MaterialSnackbar.showSnackbar(data);  
    }
  }) 
}

