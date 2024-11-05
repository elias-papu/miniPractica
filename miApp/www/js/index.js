// index.js
document.addEventListener("deviceready", onDeviceReady, false);

let db;

function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase({ name: "userDB.db", location: "default" });

    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)");
    });

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    if (window.location.pathname.endsWith("users.html")) {
        loadUsers();
    }
}

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)", [name, email, phone], function () {
            alert("User registered successfully!");
            document.getElementById("registerForm").reset();
        }, function (error) {
            console.error("Error inserting user:", error);
        });
    });
}

function loadUsers() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM users", [], function (tx, results) {
            const userList = document.getElementById("userList");
            userList.innerHTML = "<ul>";

            for (let i = 0; i < results.rows.length; i++) {
                const user = results.rows.item(i);
                userList.innerHTML += `<li>${user.name} - ${user.email} - ${user.phone}</li>`;
            }

            userList.innerHTML += "</ul>";
        }, function (error) {
            console.error("Error loading users:", error);
        });
    });
}
