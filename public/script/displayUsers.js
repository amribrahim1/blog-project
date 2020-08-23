
listAllUsers({})
.then(function(result) {
  const users = result.data
  console.log(users);
  var table1,table2,table3 = "";
  for (const user of users) {
    var UID= user.uid;
    var userName = user.displayName;
    var userEmail = user.email;
    if (user.customClaims) {
      if (user.customClaims.admin == true) {
        table1 += `<tr>
                      <td>${user.email}</td>
                      <td>${user.uid}</td>
                      <td>${user.displayName}</td>
                      <td>${user.emailVerified}</td>
                      <td>${user.customClaims.admin}</td>
                      <td>${user.metadata.lastSignInTime}</td>
                      <td>${user.metadata.creationTime}</td>
                      <td><a class="btn btn-warning" onclick="updateUsers('${UID}','${userName}','${userEmail}')">upate user</a></td>
                   </tr>`;
      } if (user.customClaims.admin == false) {
          table2 += `<tr>
                        <td>${user.email}</td>
                        <td>${user.uid}</td>
                        <td>${user.displayName}</td>
                        <td>${user.emailVerified}</td>
                        <td>${user.customClaims.admin}</td>
                        <td>${user.metadata.lastSignInTime}</td>
                        <td>${user.metadata.creationTime}</td>
                        <td><a class="btn btn-warning" onclick="updateUsers('${UID}','${userName}','${userEmail}')">upate user</a></td>
                        <td id="dialog${UID}updateUser" style="display:none" title="Update User">
                          uid: ${UID}<br><br>
                          <label style="width:100px">Display Name </label><input type="text" id="newName${UID}" value="${user.displayName}"><br>
                          <label style="width:100px">Email </label><input type="text" id="newEmail${UID}" value="${user.email}">
                        </td>
                      </tr>`;
      }
    } if (user.customClaims == null) {
        table3 += `<tr>
                      <td>${user.email}</td>
                      <td>${user.uid}</td>
                      <td>${user.displayName}</td>
                      <td>${user.emailVerified}</td>
                      <td>false</td>
                      <td>${user.metadata.lastSignInTime}</td>
                      <td>${user.metadata.creationTime}</td>
                      <td><a class="btn btn-warning" onclick="updateUsers('${UID}')">upate user</a></td>
                   </tr>`;   
    }
  }
     
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.admin === true || idTokenResult.claims.owner === true) {                   
          $('#usersTable').html(table1 + '<tr><td colspan="8" bgcolor="#009966"></tr>' + table2 + table3);
        } 
      })
    } 
  }); 
  
})


        /*
        const addUser = document.createElement('tr'); 
        addUser.setAttribute('id', user.uid)
        const addEmail = document.createElement('td');
        addEmail.innerHTML = user.email;
        const addUid = document.createElement('td');
        addUid.innerHTML = user.uid;
        const displayName = document.createElement('td');
        displayName.innerHTML = user.displayName;
        const phoneNumber = document.createElement('td');
        phoneNumber.innerHTML = user.phoneNumber;
        const emailVerified = document.createElement('td');
        emailVerified.innerHTML = user.emailVerified;
        const lastSignInTime = document.createElement('td');
        lastSignInTime.innerHTML = user.metadata.lastSignInTime;
        const creationTime = document.createElement('td');
        creationTime.innerHTML = user.metadata.creationTime;
        
        const usersTable = document.getElementById('users-table');  
        usersTable.appendChild(addUser);

        addUser.innerHTML+= addEmail.outerHTML + addUid.outerHTML + displayName.outerHTML + phoneNumber.outerHTML + emailVerified.outerHTML + lastSignInTime.outerHTML + creationTime.outerHTML;
        */
const updateUser = functions.httpsCallable('updateUser');
/* function updateUsers(UID) {
  updateUser({ uid: UID, 
    displayName: 'New Test',
  })
  .then(function(result) {
		// See the UserRecord reference doc for the contents of userRecord.
		console.log(result);
	})
  .catch(function(error) {
  console.log('Error updating user:', error);
  });
} */
 
function updateUsers(UID,userName,userEmail) {
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
        if (result.data.error) {
          alert (result.data.error.errorInfo.message)
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
