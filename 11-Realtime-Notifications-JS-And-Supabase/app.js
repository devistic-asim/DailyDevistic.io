// Load user roles from JSON file
async function loadUserRoles() {
  const response = await fetch('roles.json');
  const data = await response.json();
  return data.users;
}

// Initialize Supabase Client
const SUPABASE_URL = 'https://yvgjodyonrtjissncozo.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z2pvZHlvbnJ0amlzc25jb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM3OTI3NTMsImV4cCI6MjAzOTM2ODc1M30.4tXASkruTDq_GWubBcINxe-qakeCY9X5p18CTBg7QVc'; // Replace with your Supabase anon key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const channel = supabase.channel('room-1', {
  config: {
    broadcast: { self: false },
    ack: true
  },
});

// Function to display a message
async function displayMessage(message, userId, type) {
debugger
  if (userId === 0 || userId === currentUser.id) {

    if (type === 'popup') {
      await fetchDataAndShowPopup();
    }
    else if (type === 'msg') {
      const messageList = $('#messageList');
      const listItem = $('<li></li>').text(message);
      messageList.append(listItem);

    }
    else {

    }

  }

}

// // Fetch data from Supabase and display it in the modal
// $('#fetchDataAndShowPopup').on('click', async () => {
//   await fetchDataAndShowPopup();
// });

async function fetchDataAndShowPopup() {
  try {
    // Query Supabase for data (replace with your table and fields)
    const { data, error } = await supabase
      .from('Notifications') // Replace 'Notifications' with your actual table name
      .select('*'); // Adjust the query as needed

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    // Populate modal with data
    const dataList = $('#recordTable tbody');
    dataList.empty(); // Clear any existing content

    data.forEach(record => {
      // Format the date
      const formattedDate = new Date(record.created_at).toLocaleString();

      // Create a new row
      const tableRow = `
        <tr>
            <td>${record.id}</td>
            <td>${formattedDate}</td>
            <td>${record.subject}</td>
            <td>${record.message}</td>
        </tr>
      `;
      dataList.append(tableRow);
    });

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('dataModal'));
    modal.show();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Listen for messages
channel.on('broadcast', { event: 'test' }, (payload) => {
  displayMessage(payload.payload.message, payload.payload.userId, payload.payload.type);
}).subscribe();

// Admin-only functions
async function initializeAdminFunctions() {
  const users = await loadUserRoles();

  users.forEach(user => {
    if (user.role !== 'admin') {
      const userOption = `<option value="${user.id}">${user.username}</option>`;
      $('#userSelect').append(userOption);
    }
  });

  users.forEach(user => {
    const userRow = `<tr>
      <td>${user.username}</td>
      <td><button class="btn btn-sm btn-info" onclick="showPopupForUser(${user.id})">Show Popup</button></td>
    </tr>`;
    $('#userTable tbody').append(userRow);
  });

  $('#showAllPopups').on('click', () => {
    const message = `Popup for all users`;
    channel.send({
      type: 'broadcast',
      event: 'test',
      payload: { message, userId: 0, type: 'popup' }
    });
  });
}

// Send message function
$('#sendMessage').on('click', () => {
  const message = $('#messageInput').val();
  const userId = $('#userSelect').val(); // Get the selected user ID

  if (message.trim()) {
    channel.send({
      type: 'broadcast',
      event: 'test',
      payload: { message, userId: parseInt(userId), type: 'msg' }
    }).then(() => {
      $('#messageInput').val('');
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  }
});

// Show popup for specific user
function showPopupForUser(userId) {
  const message = `Popup for user ${userId}`;
  channel.send({
    type: 'broadcast',
    event: 'test',
    payload: { message, userId: userId, type: 'popup' }
  });
}

// Check if user is admin
// Simulate different users for testing
// const currentUsername = 'admin'; // Change this value to 'user1', 'user2', etc., to test different roles
var currentUsername = prompt("Please write username:");
var currentUser;

async function checkAdmin() {
  const users = await loadUserRoles();
  currentUser = users.find(user => user.username === currentUsername);

  if (currentUser && currentUser.role === 'admin') {
    initializeAdminFunctions();
    return true;
  }
  return false;
}

// Initialize the app
checkAdmin().then(isAdmin => {
  if (isAdmin) {
    showAdminSection();
  } else {
    console.log('Not an admin');
  }
});

// Show the admin section if the user is an admin
function showAdminSection() {
  document.getElementById('adminSection').style.display = 'block';
}
