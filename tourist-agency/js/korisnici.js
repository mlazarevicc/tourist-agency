var firebaseUrl =
  "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

getpodaci()
//fixedColumn()

function getpodaci(){

    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){

            removeTableRows('allUsers');

            let podaci = JSON.parse(this.responseText);
            for(let id in podaci) {
                let user = podaci[id];
                appenduserRow('allUsers',id,user);
            }

        } else {
            alert("Greska prilikom ucitavanja korisnika");
            window.location.href = 'error.html';
        }
      }

    }

    request.open('GET',firebaseUrl.concat('/korisnici.json'));
    request.send();
}

function removeTableRows(tBodyId){
    let tBody = document.getElementById(tBodyId);

    while(tBody.firstChild){
        tBody.removeChild(tBody.lastChild);
    }
}

function appenduserRow(tbodyId,userID,user){

    let userTr = document.createElement('tr');
  
    let korImeTd = document.createElement('td');
    korImeTd.innerText = user.korisnickoIme;
    userTr.appendChild(korImeTd);

    let lozinkaTd = document.createElement('td');
    lozinkaTd.innerText = user.lozinka;
    userTr.appendChild(lozinkaTd);

    let imeTd = document.createElement('td');
    imeTd.innerText = user.ime;
    userTr.appendChild(imeTd);
  
    let prezimeTd = document.createElement('td');
    prezimeTd.innerText = user.prezime;
    userTr.appendChild(prezimeTd);

    let emailTd = document.createElement('td');
    emailTd.innerText = user.email;
    userTr.appendChild(emailTd);

    let datumTd = document.createElement('td');
    datumTd.innerText = user.datumRodjenja;
    userTr.appendChild(datumTd);

    let adresaTd = document.createElement('td');
    adresaTd.innerText = user.adresa;
    userTr.appendChild(adresaTd);

    let telefonTd = document.createElement('td');
    telefonTd.innerText = user.telefon;
    userTr.appendChild(telefonTd);

    let icon = document.createElement('i');
    icon.classList.add('bx', 'bxs-trash');
    var deleteBtn = document.createElement('button');
    deleteBtn.type ='button';
    deleteBtn.appendChild(icon);
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'rounded-9')
    deleteBtn.setAttribute('data-userid',userID);
    deleteBtn.setAttribute('data-bs-toggle',"modal")
    deleteBtn.setAttribute('data-bs-target',"#modal2");

    deleteBtn.addEventListener('click', function() {
      var button = document.getElementById('modal-save-del');
      button.setAttribute('data-userid',this.getAttribute('data-userid'));
      deleteUser(user)
    })

    icon = document.createElement('i');
    icon.classList.add('bx', 'bxs-edit');
    var editBtn = document.createElement('button');
    editBtn.type='button';
    editBtn.appendChild(icon);
    editBtn.classList.add('btn', 'btn-sm', 'btn-success', 'rounded-9','me-md-1', 'mb-1', 'mb-lg-0')
    editBtn.setAttribute('data-userid',userID);

    editBtn.addEventListener('click', function() {
      var editButton = this;

      let popup = document.getElementById('loginForm');
      popup.style.display = 'block';
      let login = popup.getElementsByTagName('form').item(0);
      login.style.display = 'none'
      document.body.style.overflow = 'hidden';

      let form = document.getElementsByClassName('reg-form').item(0);
      form.style.display = 'block';

      document.getElementById('regSubmitButton').style.display = 'none';
      document.getElementById('editSubmitButton').style.display = 'block';

      let inputs = form.getElementsByTagName('input');

      inputs.item(0).value = user.korisnickoIme;
      inputs.item(1).value = user.lozinka;
      inputs.item(2).value = user.lozinka;
      inputs.item(3).value = user.ime;
      inputs.item(4).value = user.prezime;
      inputs.item(5).value = user.email;
      inputs.item(6).value = user.datumRodjenja;
      inputs.item(7).value = user.telefon;
      inputs.item(8).value = user.adresa;

      document.getElementById('close-reg-button').addEventListener('click', function(e) {
        e.preventDefault()
        popup.style.display = 'none';
        document.body.style.overflow = 'scroll';
      });
      let submit = document.getElementById('editSubmitButton')
      submit.addEventListener('click', function(e) {

        e.preventDefault();
        editUser(editButton)
      })
  });

    let deleteEditTd = document.createElement('td');
    
    deleteEditTd.classList.add('ps-4', 'deleteEditTd');
    deleteEditTd.appendChild(editBtn);
    deleteEditTd.appendChild(deleteBtn);
    userTr.appendChild(deleteEditTd);
  
    let tbody = document.getElementById(tbodyId);
    tbody.appendChild(userTr);
}

function deleteUser (user) {
  var deleteButton = document.getElementById('modal-save-del');
  deleteButton.addEventListener('click', function() {
    let putRequest = new XMLHttpRequest();

    putRequest.onreadystatechange = function(e){
      if(this.readyState==4){
        if(this.status==200){
          window.location.href="izmena_korisnika.html";
        }else{
          alert("Greska prilikom izmene korisnika");
          window.location.href = 'error.html';
        }
      }
    }

    putRequest.open('DELETE',firebaseUrl.concat('/korisnici/',this.getAttribute('data-userid'),'.json'));
    putRequest.send(JSON.stringify(user));
  })
}

function editUser(button) {

    if (!ValidForm('edit')){
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

    let putRequest = new XMLHttpRequest();

    putRequest.onreadystatechange = function(e){

      if(this.readyState==4){
        if(this.status==200){
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
        }else{
          alert("Greska prilikom izmene korisnika");
          window.location.href = 'error.html';
        }
      }
    }

    putRequest.open('PUT',firebaseUrl.concat('/korisnici/',button.getAttribute('data-userid'),'.json'));
    putRequest.send(JSON.stringify(user));
    
}

function fixedColumn() {
  window.addEventListener('DOMContentLoaded', function() {
    var table = document.querySelector('.table');
    var tableWrapper = document.querySelector('.table-responsive');
  
    if (table && tableWrapper) {
      var lastColumn = table.querySelector('tr th:last-child');
      var lastColumnCells = table.querySelectorAll('tr td:last-child');
  
      // Postavi širinu poslednje kolone
      var lastColumnWidth = lastColumn.offsetWidth;
      lastColumnCells.forEach(function(cell) {
        cell.style.width = lastColumnWidth + 'px';
      });
  
      // Prati scroll tabela i pomeraj poslednju kolonu
      tableWrapper.addEventListener('scroll', function() {
        lastColumn.style.transform = 'translateX(' + this.scrollLeft + 'px)';
      });
    }
  });
}