document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('phoneNumber').value = user.phoneNumber;
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
});

document.getElementById('updateProfile').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullName, username, email, phoneNumber })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert('Profile updated successfully');
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
});

document.getElementById('deleteAccount').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/users/profile', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        localStorage.removeItem('token');
        window.location.href = '/';
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
});