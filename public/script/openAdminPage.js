// Are you admin?
window.onload = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.getIdTokenResult().then(idTokenResult => {             
          console.log(idTokenResult.claims.admin);
          if (idTokenResult.claims.admin === true || idTokenResult.claims.owner === true) {
            var notification = document.querySelector('.mdl-js-snackbar');
      var data = {
        message: `Hello ${user.displayName}`,
        timeout: 5000,
      };
      notification.MaterialSnackbar.showSnackbar(data);
            document.getElementById('LoginModal').style.display = 'none';
          } else {  alert("You're not an admin");  return false}
        })
        // Only Amr Can see (add admin form)
        var ownerEmail = 'amribrahim11@gmail.com'
        if (user.email !== ownerEmail) {
        document.getElementById('AddAdmin').style.display = 'none';
        }
      } 
    });
};
  
  // Login admin
    document.forms.LoginForm.addEventListener('submit', submitform);
  
  function submitform(e) {
    e.preventDefault();
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      document.getElementById("LoginForm").reset();
    }
  // ------------------------------------------------------
  function signout() {
    firebase.auth().signOut();
    window.location.reload();
}
// ---------------------------------------------