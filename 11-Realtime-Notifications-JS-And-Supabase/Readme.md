# Realtime Notification JS

This project is a simple web application built using JavaScript, Supabase, and Bootstrap, which allows administrators to send real-time notifications to users. The app supports role-based access control and uses Supabase's real-time broadcast feature to manage and display notifications.

## Features

- **Role-Based Access Control**: Admin and user roles loaded from a JSON file.
- **Real-Time Notifications**: Admins can send notifications to all users or specific users in real-time.
- **Popup Alerts**: Notifications can be displayed as popup alerts on user screens.
- **Message Broadcasting**: Messages can be sent to all users or specific users and displayed in a message list.
- **User Management**: Admins can manage users and trigger popups for individual users or all users.

## Technology Stack

- **Frontend**: HTML, CSS, Bootstrap 5
- **Backend**: Supabase (Real-time communication)
- **JavaScript**: Vanilla JavaScript for client-side logic

## Setup Instructions

### Prerequisites

- A Supabase account. You can sign up at [Supabase](https://supabase.com/).
- A Supabase project with a real-time feature enabled.

### License
- This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgements
- Supabase for providing an excellent real-time database and authentication service.
- Bootstrap for the UI framework.