function toggleSignIn() {    
      var email = document.getElementById('inputEmail').value;
      var password = document.getElementById('inputPassword').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
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
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]

    document.getElementById('quickstart-sign-in').disabled = true;
  }

  // Sends an email verification to the user.
  function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }

  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        // [START_EXCLUDE]
        user.providerData.forEach(function (profile) {
          console.log(profile);
        });
        document.getElementById("myModal").style.display = 'none';
        document.getElementById("myBtn").style.display = 'none';
        document.getElementById("signoutBtn").style.display = 'block';
        document.getElementById("profile").style.display = 'block';
        if (user.displayName == null) {
          document.getElementById("displayName").innerHTML = "My Account"
        } else { document.getElementById("displayName").innerHTML = user.displayName }
        // [END_EXCLUDE]
      }
       else {
        // User is signed out.
        // [START_EXCLUDE]
        document.getElementById("signoutBtn").style.display = 'none';
        
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authstatelistener]

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  }
window.onload = function() {
    initApp();
};

// Get the modal
var modal = document.getElementById("myModal");
      
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
        
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
        
// When the user clicks the button, open the modal 
btn.onclick = function openSign() {
  modal.style.display = "block";
}
        
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
   modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// When the user clicks ESC key on the keyboard, close it
$(document).keydown(function(e) {
  // ESCAPE key pressed
  if (e.keyCode == 27) {
    modal.style.display = "none";
  }
});
// --------------------------------------------------------
function signOut () {
  firebase.auth().signOut();
  window.location.reload();
}

document.getElementById("forgot-password-link").addEventListener('click', function() {
  document.getElementById("forgot-password").style.display = 'block';
  document.getElementById("form-signin").style.display = 'none';
})

document.getElementById("signin-link").addEventListener('click', function() {
  document.getElementById("forgot-password").style.display = 'none';
  document.getElementById("form-signin").style.display = 'block';
})

document.getElementById("register-link").addEventListener('click', function() {
  document.getElementById("register").style.display = 'block';
  document.getElementById("form-signin").style.display = 'none';
})

document.getElementById("register-signin-link").addEventListener('click', function() {
  document.getElementById("forgot-password").style.display = 'none';
  document.getElementById("form-signin").style.display = 'block';
  document.getElementById("register").style.display = 'none';
})
// Send a password reset email
document.getElementById("reset-password").addEventListener('click', function() {
  var emailAddress = document.getElementById('email-forgot').value;
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    var notification = document.querySelector('.mdl-js-snackbar');
    var data = {
      message: 'We’ve sent you a reset password link to your Email',
      timeout: 5000,
    };
    notification.MaterialSnackbar.showSnackbar(data);
  }).catch(function(error) {
    if (error.code) {
      var notification = document.querySelector('.mdl-js-snackbar');
      var data = {
        message: error.message,
        timeout: 5000,
      };
      notification.MaterialSnackbar.showSnackbar(data);
    }
  });
})

document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
function handleSignUp() {
  // [END createwithemail]
  var email = document.getElementById('email-register').value;
  var password = document.getElementById('password-register').value;
  var displayName = document.getElementById('userName').value;
  if (displayName.length < 3) {
    document.getElementById('writeDisplayName').style.display = "block";
    return;
  }
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Create user with email and pass.
  // [START createwithemail]

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user) {
    console.log("User successfully created:", user.uid);
    firebase.database().ref('Users').child(user.uid).set({
      uid: user.uid,
      email: user.email,
      admin: 'false'
    });
    user.updateProfile({
      displayName: displayName,
    });
    sendEmailVerification();
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
}
