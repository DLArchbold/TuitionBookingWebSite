$(function () {
    $("#errorSignUp").hide();
    $("#errorSignIn").hide();
    $("#errorReset").hide();
    $("#infoReset").hide();
    $("#Signup").hide();
    $("#Signin").hide();
    $("#Logout").hide();
    $("#Profile").hide();
    initApp();


    //Sign Up

    //register user
    $("#signup-btn").click(function (event) {
        event.preventDefault();
        //register user
        var email = $("#inputSignupEmail").val();
        var password = $("#inputSignupPassword").val();
        // Leave out error handling first
        $("#errorMessage").html("");
        $("#errorMessage").hide();
        // Sign Up with email and pass.
        // [START createwithemail]
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            // Register successful.
            $("#errorSignUp").html("");
			$("#errorSignUp").hide();
			$("#inputEmail").val("");
            $("#inputSignupPassword").val("");
            $("#inputSignupPassword2").val("");

            var name = $("#inputSignupName").val();
            var contactNumber = $("#inputSignupContactNumber").val();
            var address = $("#inputSignupAddress").val();
            var usertype = $("#usertype").val();

            /*
            var objname= new Object(); objname.name = name;
            var objcontactNumber = new Object(); objcontactNumber.contactNumber = contactNumber;
            var objaddress = new Object(); objaddress.address = address;
            */


            var objDetails = new Object();
            objDetails.userid = firebase.auth().currentUser.uid;
            objDetails.name = name;
            objDetails.contactNumber = contactNumber;
            objDetails.address = address;
            objDetails.usertype = usertype;


            var db = firebase.firestore();

            //Store name
            db.collection("userdetails").doc(firebase.auth().currentUser.uid).set(objDetails).then(function () {
                location.reload();

            }).catch(function (error) {


            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]

            //Leave error handling out first
            $("#errorSignUp").show();
            if (errorCode === 'auth/wrong-password')
                $("#errorSignUp").html("Wrong password.");
            else
                $("#errorSignUp").html(errorMessage);
        });



    });

    //Sign In 
    $("#signin-btn").click(function (event) {
        event.preventDefault();
        //Sign in with email and password
        var email = $("#inputSigninEmail").val();
        var password = $("#inputSigninPassword").val();
        $("#errorSignIn").html("");
        $("#errorSignIn").hide();
      

        // Sign In with email and pass.
        // [START createwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {

            $("#errorSignIn").html("");
            $("#errorSignIn").hide();
            $("#inputText").val("");
            $("#inputSigninPassword").val("");


            location.reload();

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]


            $("#errorSignIn").show();
            if (errorCode === 'auth/wrong-password')
                $("#errorSignIn").html("Wrong password.");
            else
                $("#errorSignIn").html(errorMessage);

        });
    });

    //Reset
    $("#reset-btn").click(function (event) {
        event.preventDefault();
        var email = $("#inputResetEmail").val();
        $("#errorReset").html("");
        $("#errorReset").hide();
      
        //request for reset
        firebase.auth().sendPasswordResetEmail(email).then(function () {
            $("#errorReset").html("");
            $("#errorReset").hide();
            $("#inputResetEmail").val("");
            $("#infoReset").show();
            $("#infoReset").html("Sent.");
     
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            
            $("#errorReset").show();
            $("#errorReset").html(errorMessage);
  
        });
    });

    //Sign out
    $("#Logout").click(function (e) {
        firebase.auth().signOut();
        location.href = "index.html";
    });

});

function initApp() {
    //check user keep in cookie
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {

        // User is signed in.
        if (user == null) {

            $("#Signup").show();
            $("#Signin").show();
            $("#Logout").hide();
            $("#Profile").hide();
        } else {
            //window.location.href = "index.html";
            setProfile();
            setHide();
            $("#Signup").hide();
            $("#Signin").hide();
            $("#Logout").show();
            $("#Profile").show();

        }

    });
    // [END authstatelistener]
}

function setProfile() {
    //check user keep in cookie
    // Listening for auth state changes.
    // [START authstatelistener]
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
      db.collection("userdetails").doc(firebase.auth().currentUser.uid).get().then(function (doc) {

        var data = doc.data();
        document.getElementById('Profile').innerHTML = data.name;

      });


    });
}

function setHide(){
    var db = firebase.firestore();
            db.collection("userdetails").doc(firebase.auth().currentUser.uid).get().then(function (doc) {
                    var data = doc.data();
                    var temp = data.usertype;
                    if(temp == "teacher")
                        $("#join").hide();
                    else{    
                        $("#addSub").hide();
                        $("#delSub").hide();
                    }
            });
}