var korisnici = []

popup('login-button','loginForm')

function popup(elementId, formId) {
    var forma = document.getElementById(formId);
    var loginForm = document.getElementsByTagName('form').item(0);
    var regForm = document.getElementById('reg-form');

    document.getElementById(elementId).addEventListener('click', function() {
    forma.style.display = 'block';
    document.body.style.overflow = 'hidden';
    korisnici = getKorisnici();
  });

  document.getElementById('close-button').addEventListener('click', function(e) {
    e.preventDefault()
    forma.style.display = 'none';
    document.body.style.overflow = 'scroll';
  });

  document.getElementById('loginSubmitButton').addEventListener('click', function() {
    loginValidation(this);
  })

  document.getElementById('register-button').addEventListener('click', function() {
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
    let a = document.getElementById('confpasswordInput');
    a.disabled = true;
    document.getElementById('regSubmitButton').style.display = 'block';
    if(document.getElementById('editSubmitButton')) {
      document.getElementById('editSubmitButton').style.display = 'none';
    }
  });

  document.getElementById('close-reg-button').addEventListener('click', function(e) {
    e.preventDefault()
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  window.addEventListener('DOMContentLoaded', Validation)

  let regSubmit = document.getElementById('regSubmitButton');
  regSubmit.addEventListener('click', function(e) {
    e.preventDefault();

    registrationSubmit();
  })

}

function registrationSubmit() {
  if (!ValidForm()){
    let submitError = document.getElementById('submit-error');
    submitError.style.display = 'block'
    return
  } 

  let username = document.querySelector('input[name="usernameInput"]').value;
  let password = document.querySelector('input[name="passwordInput"]').value;
  let fname = document.querySelector('input[name="firstNameInput"]').value;
  let lname = document.querySelector('input[name="lastNameInput"]').value;
  let email = document.querySelector('input[name="emailInput"]').value;
  let dob = document.querySelector('input[name="dobInput"]').value;
  let phone = document.querySelector('input[name="phoneInput"]').value;
  let address = document.querySelector('input[name="addressInput"]').value;

  
  user = {
    korisnickoIme: username,
    lozinka: password,
    ime: fname,
    prezime: lname,
    email: email,
    datumRodjenja: dob,
    telefon: phone,
    adresa: address
  }

  var request = new XMLHttpRequest();
  let firebaseUrl = "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let popup = document.getElementById("reg-form");
      popup.style.display = "none"
      document.body.style.overflow = "scroll"

      let myToast = document.getElementById('myToast');
      let toast = new bootstrap.Toast(myToast);

      toast.show();

      setTimeout(function() {
        toast.hide();
        location.reload()
      }, 2000);
    }
  };

  request.open('POST', firebaseUrl.concat('/korisnici.json'));
  request.send(JSON.stringify(user));

}

function loginValidation() {
  let username = document.getElementById('loginUsername').value;
  let password = document.getElementById('loginPassword').value;

  let postoji = false;
  for(let i = 0; i<korisnici.length; i++) {
    if(korisnici[i].korisnickoIme === username && korisnici[i].lozinka === password) {
      postoji = true;
    }
  }
  
  if(!postoji) {
    let span = document.getElementById('invalid-login');
    span.style.display = 'block';
  } else {
    let form = document.getElementById('loginForm');
    form.style.display = 'none';
    let modal3 = document.getElementById('modal3')
    var modal = new bootstrap.Modal(modal3);
    modal.show();

    let buttons = modal3.getElementsByTagName('button');
    for(let i=0; i<buttons.length; i++) {
      buttons[i].addEventListener('click', function() {
        // document.body.style.overflow = 'scroll';
        location.reload()
      })
    }
  }

}

function Validation() {
  let usernameInput = document.querySelector('input[name="usernameInput"]');
  let passwordInput = document.querySelector('input[name="passwordInput"]');
  let fnameInput = document.querySelector('input[name="firstNameInput"]');
  let lnameInput = document.querySelector('input[name="lastNameInput"]');
  let emailInput = document.querySelector('input[name="emailInput"]');
  let dobInput = document.querySelector('input[name="dobInput"]');
  let phoneInput = document.querySelector('input[name="phoneInput"]');
  let addressInput = document.querySelector('input[name="addressInput"]');
  
  let usernameError = document.getElementById('username-error');
  let passwordError = document.getElementById('password-error');
  let fnameError = document.getElementById('firstName-error');
  let lnameError = document.getElementById('lastName-error');
  let emailError = document.getElementById('email-error');
  let dobError = document.getElementById('dob-error');
  let phoneError = document.getElementById('phone-error');
  let addressError = document.getElementById('address-error');

  validateUsername(usernameInput,usernameError);
  //validate(passwordInput,passwordError);
  validatePassword(passwordInput,passwordError);
  validateConfPassword();
  validate(fnameInput,fnameError);
  validate(lnameInput,lnameError);
  validate(emailInput,emailError);
  validateDate(dobInput,dobError);
  validate(phoneInput,phoneError);
  validate(addressInput,addressError);

}

function ValidForm(){
  let usernameInput = document.querySelector('input[name="usernameInput"]');
  let passwordInput = document.querySelector('input[name="passwordInput"]');
  let confPasswordInput = document.querySelector('input[name="confpasswordInput"]');
  let fnameInput = document.querySelector('input[name="firstNameInput"]');
  let lnameInput = document.querySelector('input[name="lastNameInput"]');
  let emailInput = document.querySelector('input[name="emailInput"]');
  let dobInput = document.querySelector('input[name="dobInput"]');
  let phoneInput = document.querySelector('input[name="phoneInput"]');
  let addressInput = document.querySelector('input[name="addressInput"]');

  let valid = false

  valid = valid || !isValid(usernameInput);
  valid = valid || !isValidPasswords(passwordInput,confPasswordInput);
  valid = valid || !isValid(fnameInput);
  valid = valid || !isValid(lnameInput);
  valid = valid || !isValid(emailInput);
  valid = valid || !isValidDate(dobInput);
  valid = valid || !isValid(phoneInput);
  valid = valid || !isValid(addressInput);

  valid = !valid

  for(let i = 0; i<korisnici.length; i++) {
    if(korisnici[i].korisnickoIme === usernameInput.value) {
      let span = document.getElementById('username-taken');
      span.style.display = 'block';
      valid = false;
    }
  }

  return valid;
}

function isValid(input) {
  if (input.validity.valid && !(input.value === '')) {
    return true
  } else {
    return false
  }
}
function isValidDate(input) {
  let date = new Date(input.value);
  let today = new Date();
  today.setHours(0,0,0,0);
  if (date > today) {
    return true
  } else {
    return false
  }
}
function isValidPasswords(passInput,confInput) {
  if (passInput.validity.valid && (passInput.value.length >= 5 ) && passInput.value === confInput.value) {
    return true
  } else {
    return false
  }
}

function validate(input,error) {
  input.addEventListener('input', function() {
    let submitError = document.getElementById('submit-error');
    if (submitError.style.display === 'block') {
      submitError.style.display = 'none';
    }
    if (isValid(input)) {
      error.style.display = 'none';
    } else {
      error.style.display = 'block';
    }
  });
}

function validateUsername(input,error) {
  input.addEventListener('input', function() {
    let submitError = document.getElementById('submit-error');
    if (submitError.style.display === 'block') {
      submitError.style.display = 'none';
    }
    let span = document.getElementById('username-taken');
    span.style.display = 'none';
    if (input.validity.valid && !(this.value==='')) {
      error.style.display = 'none';
    } else {
      error.style.display = 'block';
    }
  });
}

function validateDate(input,error) {
  input.addEventListener('input', function() {
    let submitError = document.getElementById('submit-error');
    if (submitError.style.display === 'block') {
      submitError.style.display = 'none';
    }
    if (isValidDate(this)) {
      error.style.display = 'none';
    } else {
      error.style.display = 'block';
    }
  });
}

function validatePassword(input,error) {

  input.addEventListener('input', function() {
    let submitError = document.getElementById('submit-error');
    if (submitError.style.display === 'block') {
      submitError.style.display = 'none';
    }
    if (input.validity.valid && this.value.length >= 5) {
      error.style.display = 'none';
    } else {
      error.style.display = 'block';
    }

    let a = document.getElementById('confpasswordInput');
    if(a.disabled === false && !(a.value === '')) {
      a.setAttribute('password',this.value)
      validateConfPassword(true)
    } else {
      a.disabled = false;
      a.setAttribute('password',this.value)
    }
  });
}

// compare - promenljiva koja govori da li funkcija pozvana iz validatePassword funkcije.
//         - ako jeste, samo treba da se uporede vrednosti u tim poljima
function validateConfPassword(compare) {
  var confPasswordInput = document.querySelector('input[name="confpasswordInput"]');
  var confPasswordError = document.getElementById('confPassword-error');
  let a = document.getElementById('confpasswordInput');

  if(compare) {
    if (confPasswordInput.value === a.getAttribute('password')) {
      confPasswordError.style.display = 'none';
    } else {
      confPasswordError.style.display = 'block';
    }
  }
  confPasswordInput.addEventListener('input', function() {
    if (this.validity.valid && this.value === a.getAttribute('password')) {
      confPasswordError.style.display = 'none';
    } else {
      confPasswordError.style.display = 'block';
    }
  })
}

function getKorisnici() {
  let request = new XMLHttpRequest();

  let korisnici = []
  request.onreadystatechange = function(){

    if(this.readyState==4){
      if(this.status==200){
        let podaci = JSON.parse(this.responseText);
        for(let id in podaci) {
            korisnici.push(podaci[id]);
        }
      } else {
          alert("Greska prilikom ucitavanja korisnika");
          window.location.href = 'error.html';
      }
    }

  }

  request.open('GET',firebaseUrl.concat('/korisnici.json'));
  request.send();

  return korisnici
}