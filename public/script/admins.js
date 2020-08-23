// Display admins emails in a table
const listAllUsers = firebase.functions().httpsCallable('listAllUsers');
listAllUsers({})
.then(function(result) {
    const users = result.data;
    var owners,admins = "";
    for (const user of users) {
      
      if (user.customClaims) {
        if (user.customClaims.owner == true) {
          var emailAdmin = user.email;
          var uidAdmin = user.uid;
          owners += `<tr>
                        <td>${user.email}</td>
                        <td>owner</td>
                        </tr>`;
          } else if (user.customClaims.admin == true) {
            admins += `<tr>
                        <td>${user.email}</td>
                        <td>admin</td>
                        <td><a class="btn btn-warning" onclick="removeAdmin('${emailAdmin}','${uidAdmin}')">Remove admin</a></td>
                      </tr>`;
          }
      }
 }
     
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              user.getIdTokenResult().then(idTokenResult => {
                if (idTokenResult.claims.owner === true) {
                    
                    $('#admins-table').html(owners+ '<tr><td colspan="3" bgcolor="#009966"></tr>' + admins);
                } 
              })
            } 
          }); 
})
// ------------------------------------------------------
// Remove an admin from the admins list
  function removeAdmin (emailAdmin,uidAdmin) {
    var result = confirm(`Are you sure you want to delete ${emailAdmin} from admins ?`);
    if (result) { 
      const removeAdminRole = functions.httpsCallable('removeAdminRole');
      removeAdminRole({ email: emailAdmin }).then(result => {
        console.log(result);
        firebase.database().ref('Users').child(uidAdmin).set({  
          admin: 'false',
          email: emailAdmin
        });
      });
    }
  }

// make admin
const adminForm = document.querySelector('.addAdmin');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const adminEmail = document.querySelector('#adminEmail').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result => {
      console.log(result);
      firebase.database().ref('Users').orderByChild("email").equalTo(adminEmail).on("child_added", function(snapshot) {
        snapshot.ref.set({ admin: 'true' })
      });
    });
    $('.addAdmin')[0].reset(); 
});
// ------------------------------------------------------
