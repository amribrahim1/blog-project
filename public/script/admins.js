// Display admins emails in a table
const listAllUsers = firebase.functions().httpsCallable('listAllUsers');
listAllUsers({})
.then(function(result) {
    const users = result.data;
    var allAdmins = "";
    for (const user of users) {
      
      if (user.customClaims) {
        if (user.customClaims.admin == true) {
          var emailAdmin = user.email;
          var uidAdmin = user.uid;
          var admin = `<tr>
                        <td>${user.email}</td>
                        <td>${user.customClaims.admin}</td>
                        <td><a class="btn btn-warning" onclick="removeAdmin('${emailAdmin}','${uidAdmin}')">Remove admin</a></td>
                      </tr>`;
          allAdmins = allAdmins + admin
          }
      }
 }
     
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              user.getIdTokenResult().then(idTokenResult => {
                if (idTokenResult.claims.admin === true) {
                    
                    $('#admins-table').html(allAdmins);
                } 
              })
            } 
          }); 
})
// ------------------------------------------------------
// Remove an admin from the admins list
  function removeAdmin (emailAdmin,uidAdmin) {
    var ownerEmail = 'amribrahim11@gmail.com'
      var user = firebase.auth().currentUser;
        if (user.email !== ownerEmail) {
          return { error: 'Who are you ?!' },
          alert("Only Amr can remove admins");
        }
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
    var ownerEmail = 'amribrahim11@gmail.com'
    var user = firebase.auth().currentUser;

      if (user.email !== ownerEmail) {
        return { error: 'Who are you ?!' },
        alert("Only Amr can add admins");
      } 

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
