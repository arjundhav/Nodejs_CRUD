document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            if (response.ok) {
                alert('User registered successfully!');
                window.location.href = './users.html';
                // document.getElementById('registerForm').reset();
            } else {
                alert('Error registering user');
            }
        });
    }

    if (document.getElementById('userTable')) {
        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const users = await response.json();
            const userTable = document.getElementById('userTable');

            userTable.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="deleteUser('${user._id}')">Delete</button>
                        <button onclick="editUser('${user._id}')">Edit</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        };

        fetchUsers();
    }
});

const deleteUser = async (id) => {
    const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('User deleted successfully!');
        location.reload();
    } else {
        alert('Error deleting user');
    }
};

const editUser = async (id) => {
    const newName = prompt('Enter new name:');
    const newEmail = prompt('Enter new email:');
    if (newName && newEmail) {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName, email: newEmail })
        });

        if (response.ok) {
            alert('User updated successfully!');
            location.reload();
        } else {
            alert('Error updating user');
        }
    }
};
