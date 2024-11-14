
const users = [];

// Função para salvar os dados no LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Função para carregar os dados do LocalStorage
function loadFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users.push(...JSON.parse(storedUsers));
        displayUsers();
    }
}

// Função para adicionar ou editar um usuário
let editMode = false;
let currentUserId = null;

function addUser(name, email) {
    if (editMode) {
        const user = users.find(u => u.id === currentUserId);
        if (user) {
            user.name = name;
            user.email = email;
            showNotification('Usuário editado com sucesso!');
        }
    } else {
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email
        };
        users.push(newUser);
        showNotification('Usuário adicionado com sucesso!');
    }
    
    saveToLocalStorage();
    displayUsers();
}

// Função para abrir o modal de adicionar/editar
function openModal(isEdit = false, userId = null) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    
    if (isEdit) {
        editMode = true;
        currentUserId = userId;
        const user = users.find(u => u.id === userId);
        if (user) {
            nameInput.value = user.name;
            emailInput.value = user.email;
        }
        modalTitle.innerText = 'Editar Usuário';
    } else {
        editMode = false;
        modalTitle.innerText = 'Adicionar Usuário';
        nameInput.value = '';
        emailInput.value = '';
    }
    
    modal.style.display = 'flex';
}

// Fechar o modal
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('userModal').style.display = 'none';
});

// Salvar o usuário ao clicar em "Salvar"
document.getElementById('saveUserBtn').addEventListener('click', () => {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    if (name && email) {
        addUser(name, email);
        document.getElementById('userModal').style.display = 'none';
    }
});

// Função para editar um usuário
function editUser(userId) {
    openModal(true, userId);
}

// Função para excluir um usuário
function deleteUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveToLocalStorage();
        displayUsers();
        showNotification('Usuário excluído com sucesso!');
    }
}

// Função para exibir os usuários na tela
function displayUsers() {
    const contentUser = document.querySelector('.content-user');
    contentUser.innerHTML = '';

    users.sort((a, b) => a.name.localeCompare(b.name)).forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.innerHTML = `
            <div class="number-order">${index + 1}</div>
            <div class="name-user">${user.name}</div>
            <div class="email-user">${user.email}</div>
            <button onclick="editUser(${user.id})">Editar</button>
            <button onclick="deleteUser(${user.id})">Excluir</button>
        `;
        contentUser.appendChild(userDiv);
    });
}

// Função para mostrar uma notificação
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Função debounce para otimizar a busca
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Filtrar usuários durante a pesquisa
document.getElementById('searchInput').addEventListener('input', debounce((e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchValue) || 
        user.email.toLowerCase().includes(searchValue)
    );
    displayFilteredUsers(filteredUsers);
}, 300));

// Exibir os usuários filtrados
function displayFilteredUsers(filteredUsers) {
    const contentUser = document.querySelector('.content-user');
    contentUser.innerHTML = '';

    filteredUsers.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.innerHTML = `
            <div class="number-order">${index + 1}</div>
            <div class="name-user">${user.name}</div>
            <div class="email-user">${user.email}</div>
            <button onclick="editUser(${user.id})">Editar</button>
            <button onclick="deleteUser(${user.id})">Excluir</button>
        `;
        contentUser.appendChild(userDiv);
    });
}

// Abrir o modal para adicionar um usuário
document.getElementById('addUserBtn').addEventListener('click', () => {
    openModal(false);
});

// Carregar usuários ao carregar a página
window.onload = () => {
    loadFromLocalStorage();
};
