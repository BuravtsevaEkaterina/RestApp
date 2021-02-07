$(document).ready(function () {
    getAllUsers();

    $("#newUserForm").submit(function (event) {
        event.preventDefault();
        addNewUser();
    });
})


function getAllUsers() {
    fetch("/rest/admin/users")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            $("#usersInfoTable").empty();
            allUsersTableConstructor(data, $("#uTable"))
        })
        .catch(function (error) {
            console.log("Error " + error);
        })
}

function getUserInfo(id) {
    fetch("/rest/admin/users/" + id)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            $("#infoTable").empty();
            userTableConstructor(data, $("#userInfoTable"));
            $('#userInfo').addClass("show active");
            $('#userPill').addClass("active");
            $('#userInfoTable').removeClass("show active");
            $('#adminPill').removeClass("active");
        })
        .catch(function (error) {
            console.log("Error " + error);
        })
}

function addNewUser() {

    let newUser = {
        username: $("#username").val(),
        lastname: $("#lastName").val(),
        age: $("#age").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        roles: $("#role").val(),
    }

    fetch("/rest/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function () {
            getAllUsers();
            $('#usersTable').addClass("show active");
            $('#navAllUsers').addClass('active');
            $('#newUser').removeClass("show active");
            $('#navNewUser').removeClass("active");
        })
        .catch(error => console.log("Error " + error))
}


function editUserFunc() {
    let id = $("#editId").val();

    let userForEdit = {
        id: id,
        username: $("#editUsername").val(),
        lastname: $("#editLastname").val(),
        age: $("#editAge").val(),
        email: $("#editEmail").val(),
        password: $("#editPassword").val(),
        roles: $("#editRoles").val(),
    }

    fetch("/rest/admin/users/" + id, {
        method: "PUT",
        body: JSON.stringify(userForEdit),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function () {
            getAllUsers();
        })
        .catch(error => console.log("Error " + error))

}

function deleteUserFunc() {
    let id = $("#deleteId").val();

    fetch("/rest/admin/users/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function () {
            getAllUsers();
        })
        .catch(error => console.log("Error " + error))
}


function getUserForUpd(id) {
    fetch("/rest/admin/users/" + id)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            $(".modal-body #editId").val(data.id);
            $(".modal-body #editUsername").val(data.username);
            $(".modal-body #editLastname").val(data.lastname);
            $(".modal-body #editAge").val(data.age);
            $(".modal-body #editEmail").val(data.email);
            $(".modal-body #editRoles").val(data.roles);
            $("#editRoles option:last").prop('selected', true);
        })
        .catch(function (error) {
            console.log("Error " + error);
        })
}

function getUserForDel(id) {
    fetch("/rest/admin/users/" + id)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            $(".modal-body #deleteId").val(data.id);
            $(".modal-body #deleteUsername").val(data.username);
            $(".modal-body #deleteLastname").val(data.lastname);
            $(".modal-body #deleteAge").val(data.age);
            $(".modal-body #deleteEmail").val(data.email);
            $(".modal-body #deleteRoles").val(data.roles);
        })
        .catch(function (error) {
            console.log("Error " + error);
        })
}

function allUsersTableConstructor(data, id) {
    for (let i = 0; i < data.length; i++) {
        let userRoles = setRoles(data[i].roles);

        let row = `<tr>
              <td>${data[i].id}</td>
              <td>${data[i].username}</td>
              <td>${data[i].lastname}</td>
              <td>${data[i].age}</td>
              <td>${data[i].email}</td>
              <td>${userRoles}</td>
              <td><button onclick=getUserForUpd(${data[i].id}) 
              class='btn btn-md btn-info eBtn' data-toggle='modal' 
              data-target='#editModal'>Edit
              </button></td>" +
              <td><button onclick=getUserForDel(${data[i].id})
              class='btn btn-md btn-danger dBtn' data-toggle='modal' 
              data-target='#deleteModal'>Delete
              </button></td>
              </tr>`
        id.append(row);
    }
}

function userTableConstructor(data, id) {

    let userRoles = setRoles(data.roles);

    let row = `<tr>
              <td>${data.id}</td>
              <td>${data.username}</td>
              <td>${data.lastname}</td>
              <td>${data.age}</td>
              <td>${data.email}</td>
              <td>${userRoles}</td>
              </tr>`
    id.append(row);
}

function setRoles(roles) {
    let userRoles = "";
    for (let role of roles) {
        userRoles += role.rolename.substring(5) + " ";
    }
    return userRoles;
}