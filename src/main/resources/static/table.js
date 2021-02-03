let usersInfoTable;

$(document).ready(function () {
    usersInfoTable = $("#usersInfoTable")
    allUsersTable();

    $("#newUserForm").submit(function (event) {
        event.preventDefault();
        addNewUser();
    });

    $('.table .eBtn').on('click', function (event) {
        $('.modal #editModal').modal();
    });

    $('.table .dBtn').on('click', function (event) {
        $('.modal #deleteModal').modal();
    });

});


function allUsersTable() {
    const url = "/users";

    $.get(url, function (responseJson) {
        usersInfoTable.empty();

        $.ajax("/users", {
            dataType: "json",
            success: function (data) {
                const users = JSON.parse(JSON.stringify(data));

                for (let i = 0; i < users.length; i++) {
                    let userRoles = "";
                    for (let element of users[i].roles) {
                        userRoles += element.rolename.substring(5) + " ";
                    }

                    let tr = $("<tr>").attr("id", users[i].id);
                    tr.append("" +
                        "<td>" + users[i].id + "</td>" +
                        "<td>" + users[i].username + "</td>" +
                        "<td>" + users[i].lastname + "</td>" +
                        "<td>" + users[i].age + "</td>" +
                        "<td>" + users[i].email + "</td>" +
                        "<td>" + userRoles + "</td>" +
                        "<td><button onclick='getUserForEdit(" + users[i].id + ")' class='btn btn-md btn-info eBtn' data-toggle='modal' data-target='#editModal'>Edit</button></td>" +
                        "<td><button onclick='getUserForDelete(" + users[i].id + ")' class='btn btn-md btn-danger dBtn' data-toggle='modal' data-target='#deleteModal'>Delete</button> </td>"
                    );
                    $("#uTable").append(tr)
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
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

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/users",
        data: JSON.stringify(newUser),
    })
        .done(function (data) {
            allUsersTable();
            $('#usersTable').addClass("show active");
            $('#navAllUsers').addClass('active');
            $('#newUser').removeClass("show active");
            $('#navNewUser').removeClass("active");
        })
        .fail(function (error) {
            console.log(error);
        });
}

function getUserForEdit(id) {
    $.ajax("/users/" + id, {
        dataType: "json",
    })
        .done(function (user) {
            $(".modal-body #editId").val(user.id);
            $(".modal-body #editUsername").val(user.username);
            $(".modal-body #editLastname").val(user.lastname);
            $(".modal-body #editAge").val(user.age);
            $(".modal-body #editEmail").val(user.email);
            $(".modal-body #editRoles").val(user.roles);
            $("#editRoles option:last").prop('selected', true);
        });
}

function editUserFunc() {
    let editUser = {
        id: $("#editId").val(),
        username: $("#editUsername").val(),
        lastname: $("#editLastname").val(),
        age: $("#editAge").val(),
        email: $("#editEmail").val(),
        password: $("#editPassword").val(),
        roles: $("#editRoles").val(),
    }

    $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: "/edit",
        data: JSON.stringify(editUser),
    })
        .done(function (data) {
            allUsersTable();
        })
        .fail(function (error) {
            console.log(error);
        });
}

function getUserForDelete(id) {
    $.ajax("/users/" + id, {
        dataType: "json",
    })
        .done(function (user) {
            $(".modal-body #deleteId").val(user.id);
            $(".modal-body #deleteUsername").val(user.username);
            $(".modal-body #deleteLastname").val(user.lastname);
            $(".modal-body #deleteAge").val(user.age);
            $(".modal-body #deleteEmail").val(user.email);
            $(".modal-body #deleteRoles").val(user.roles);
        });
}

function deleteUserFunc() {

    let id = $("#deleteId").val();

    $.ajax({
        type: "DELETE",
        url: "/users/" + id,
        contentType: "application/json",
    })
        .done(function (data) {
            allUsersTable();
        })
        .fail(function (error) {
            console.log(error);
        });
}
