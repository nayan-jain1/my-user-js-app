const userTableBody = document.querySelector('#userTable tbody');
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const editIndexInput = document.getElementById('editIndex');
let users = JSON.parse(localStorage.getItem('users')) || [];
let filters = {};
let currentPage = 1;
const rowsPerPage = 5;

function renderTable() {
  const filteredUsers = users.filter(user => {
    return Object.keys(filters).every(key =>
      user[key].toLowerCase().includes(filters[key].toLowerCase())
    );
  });
  const paginated = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  userTableBody.innerHTML = '';
  paginated.forEach((user, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.username}</td>
      <td>${user.city}</td>
      <td>${user.department}</td>
      <td class="actions">
        <button onclick="editUser(${index + (currentPage - 1) * rowsPerPage})">Edit</button>
        <button onclick="deleteUser(${index + (currentPage - 1) * rowsPerPage})">Delete</button>
      </td>
    `;
    userTableBody.appendChild(tr);
  });
  renderPagination(filteredUsers.length);
}

function renderPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(btn);
  }
}

function openModal() {
  document.getElementById('modalTitle').innerText = 'Add User';
  userForm.reset();
  editIndexInput.value = '';
  userModal.style.display = 'flex';
}

function closeModal() {
  userModal.style.display = 'none';
}

function saveUser(event) {
  event.preventDefault();
  const user = {
    firstName: userForm.firstName.value,
    lastName: userForm.lastName.value,
    username: userForm.username.value,
    city: userForm.city.value,
    department: userForm.department.value
  };
  const editIndex = editIndexInput.value;
  if (editIndex) {
    users[editIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('users', JSON.stringify(users));
  closeModal();
  renderTable();
}

function editUser(index) {
  const user = users[index];
  userForm.firstName.value = user.firstName;
  userForm.lastName.value = user.lastName;
  userForm.username.value = user.username;
  userForm.city.value = user.city;
  userForm.department.value = user.department;
  editIndexInput.value = index;
  document.getElementById('modalTitle').innerText = 'Edit User';
  userModal.style.display = 'flex';
}

function deleteUser(index) {
  if (confirm('Are you sure you want to delete this user?')) {
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    renderTable();
  }
}

function applyFilters() {
  document.querySelectorAll('.filter-input').forEach(input => {
    filters[input.dataset.key] = input.value;
  });
  currentPage = 1;
  renderTable();
}

renderTable();
