firebase.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    // [END_EXCLUDE]
    if (user) {
        // User is signed in.
        // [START_EXCLUDE]
        $('#avatar').attr("src", user.photoURL);
        if (user.photoURL == null) {
          $('#avatar').attr("src", 'avatar.jpg');
        }
        $('#uid').html(user.uid);    
        $('#displayName').html(user.displayName);  
        $('#usertitle').html(user.displayName);
        $('#newName').val(user.displayName);
        $('#email').html(user.email);
        $('#newEmail').val(user.email);
        console.log(user.emailVerified);
        if(!user.emailVerified) {
            $('#verify').html(`<button onclick="sendEmailVerification()" style="width:250px">send email verification</button>`)
        } else {
            $('#verify').html('Yes')
        }
        $('#updateProfile').submit(function(e){
            e.preventDefault();
            updateProfile(user)                
        })
        $('#updatePassword').submit(function(e){
          e.preventDefault();
          updatePassword(user)  
        });
        $('#uploadPhoto').submit(function(e){
          e.preventDefault();
          uploadPhoto(user)  
        });
    } else {
      document.getElementById('sign-in').style.display = 'block';
      setTimeout(function(){ window.location = "index.html"; },5000);
    }
})

function updateProfile(user) {
  user.updateProfile({
    displayName: $('#newName').val(),
  });
  user.updateEmail($('#newEmail').val()).then(function() {
    var notification = document.querySelector('.mdl-js-snackbar');
    var data = {
      message: 'Your profile has been update, reload page',
      actionHandler: function() {
        window.location.reload();
      },
      actionText: 'Reload',
      timeout: 5000,
    }; 
    notification.MaterialSnackbar.showSnackbar(data);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode) {
      var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
          message: errorMessage,
          timeout: 5000,
        };
        notification.MaterialSnackbar.showSnackbar(data);
        return false;
    }
    // [END_EXCLUDE]
  }).then (function () {
    user.getIdTokenResult().then(idTokenResult => {             
      console.log(idTokenResult.claims.admin);
     
      if (idTokenResult.claims.admin === true) {
        firebase.database().ref('Users').child(user.uid).set({        
          'Display Name': user.displayName,
          uid: user.uid,
          email: user.email,
          admin: idTokenResult.claims.admin
        });
      } else {
        firebase.database().ref('Users').child(user.uid).set({        
          'Display Name': user.displayName,
          uid: user.uid,
          email: user.email,
          admin: 'false',
        });
      }
    })
});
  // firebase.database().ref('Users').orderByChild("email").equalTo(user.email).on("child_added", function(snapshot) {
  //  snapshot.ref.update({ email: $('#newEmail').val() });    
  // })
}

function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode) {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
    // [END sendemailverification]
}

function updatePassword(user) {
  user.updatePassword($('#newPassword').val()).then(function() {
    var notification = document.querySelector('.mdl-js-snackbar');
      var data = {
        message: 'Password updated successfully',
        timeout: 5000,
      };
      notification.MaterialSnackbar.showSnackbar(data);
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode) {
      var notification = document.querySelector('.mdl-js-snackbar');
      var data = {
        message: errorMessage,
        timeout: 5000,
      };
      notification.MaterialSnackbar.showSnackbar(data);
      return false;
    }
  });     
};

// Show Password
  $("#showhide").click(function () {
  if ($("#newPassword").attr("type")=="password") {
  $("#newPassword").attr("type", "text");
  }
  else{
   $("#newPassword").attr("type", "password");
  }
});

// function sign out user
function signout() {
    firebase.auth().signOut();
    console.log('signed-out');
    window.location.href = "index.html";
}

function uploadPhoto() {
  firebase.auth().onAuthStateChanged(function(user) {
    var imageFile = document.getElementById('fileElem').files[0];
    firebase.storage().ref().child(`users/${user.uid}/avatar.jpg`).put(imageFile); 
    firebase.storage().ref().child(`users/${user.uid}/avatar.jpg`).getDownloadURL().then(function(url) {                 
      user.updateProfile({
        photoURL: url
      }).then(function() {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
          message: 'Your profile has been update, reload page',
          actionHandler: function() {
            window.location.reload();
          },
          actionText: 'Reload',
          timeout: 5000,
        }; 
        notification.MaterialSnackbar.showSnackbar(data);
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode) {
          var notification = document.querySelector('.mdl-js-snackbar');
          var data = {
            message: errorMessage,
            timeout: 5000,
          };
          notification.MaterialSnackbar.showSnackbar(data);
          return false;
        }
      });
    }).then (function() {
      firebase.database().ref('Users').child(user.uid).set({        
        'Display Name': user.displayName,
        photoURL: user.photoURL,
      });
    }) 
  })
}