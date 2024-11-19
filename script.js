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

function addUser(name, ddd, phone) {
    const contact = `(${ddd}) 9${phone}`;
    if (editMode) {
        const user = users.find(u => u.id === currentUserId);
        if (user) {
            user.name = name;
            user.contact = contact;
            showNotification('Usuário editado com sucesso!');
        }
    } else {
        const newUser = {
            id: users.length + 1,
            name: name,
            contact: contact,
        };
        users.push(newUser);
        showNotification('Usuário adicionado com sucesso!');
    }

    saveToLocalStorage();
    displayUsers();
}

// Função para validar os campos
function validateFields(name, ddd, phone) {
    const nameMaxLength = 50;
    const phoneMaxLength = 8;

    if (name.length > nameMaxLength) {
        alert(`O nome não pode ter mais de ${nameMaxLength} caracteres.`);
        return false;
    }

    if (!/^\d+$/.test(phone) || phone.length !== phoneMaxLength) {
        alert('O número de telefone deve conter exatamente 8 dígitos numéricos.');
        return false;
    }

    return true;
}

// Função para abrir o modal de adicionar/editar
function openModal(isEdit = false, userId = null) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const nameInput = document.getElementById('userName');
    const dddSelect = document.getElementById('dddSelect');
    const phoneInput = document.getElementById('phoneNumber');

    if (isEdit) {
        editMode = true;
        currentUserId = userId;
        const user = users.find(u => u.id === userId);
        if (user) {
            nameInput.value = user.name;
            const [ddd, phone] = user.contact.match(/\((\d+)\) 9(\d+)/).slice(1);
            dddSelect.value = ddd;
            phoneInput.value = phone;
        }
        modalTitle.innerText = 'Editar Usuário';
    } else {
        editMode = false;
        modalTitle.innerText = 'Adicionar Usuário';
        nameInput.value = '';
        dddSelect.value = '91';
        phoneInput.value = '';
    }

    modal.style.display = 'flex';
}

// Fechar o modal
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('userModal').style.display = 'none';
});

// Salvar o usuário ao clicar em "Salvar"
document.getElementById('saveUserBtn').addEventListener('click', () => {
    const name = document.getElementById('userName').value.trim();
    const ddd = document.getElementById('dddSelect').value;
    const phone = document.getElementById('phoneNumber').value.trim();

    if (name && ddd && phone) {
        if (validateFields(name, ddd, phone)) {
            addUser(name, ddd, phone);
            document.getElementById('userModal').style.display = 'none';
        }
    } else {
        alert('Por favor, preencha todos os campos.');
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
            <div class="email-user">${user.contact}</div>
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

// Abrir o modal para adicionar um usuário
document.getElementById('addUserBtn').addEventListener('click', () => {
    openModal(false);
});

// Carregar usuários ao carregar a página
window.onload = () => {
    loadFromLocalStorage();
};
