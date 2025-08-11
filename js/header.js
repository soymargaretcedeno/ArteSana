// Función para actualizar el header cuando el usuario se registra
function updateHeaderAfterRegistration(username) {
    // Eliminar el header actual
    const headerComponent = document.getElementById('header-component');
    if (headerComponent) {
        headerComponent.innerHTML = '';
    }

    // Cargar el nuevo header de usuario registrado
    fetch('components/user-header.html')
        .then(response => response.text())
        .then(html => {
            headerComponent.innerHTML = html;
            
            // Actualizar el nombre del usuario y su inicial
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = username;
            }
        })
        .catch(error => console.error('Error loading user header:', error));
}

// Mostrar header adecuado en cada carga
document.addEventListener('DOMContentLoaded', function() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        updateHeaderAfterRegistration(storedUsername);
    }
});
