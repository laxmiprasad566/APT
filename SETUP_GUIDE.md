# 🛠️ Setup & Deployment Guide

This guide provides step-by-step instructions on how to get the **APT Planner** code from GitHub, set it up on your local machine, and access it from other devices on your network.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js** (Version 18 or higher) - [Download Here](https://nodejs.org/)
2.  **Git** - [Download Here](https://git-scm.com/)
3.  **VS Code** (Optional, for editing) - [Download Here](https://code.visualstudio.com/)

---

## 🚀 Getting the Code

1.  **Open your terminal** (Command Prompt, PowerShell, or Terminal).
2.  **Navigate to the folder** where you want to store the project.
3.  **Clone the repository**:
    ```bash
    git clone <YOUR_GITHUB_REPO_URL>
    ```
    *(Replace `<YOUR_GITHUB_REPO_URL>` with the actual URL of your GitHub repository)*

4.  **Enter the project directory**:
    ```bash
    cd AI_Trip_Planner
    ```

---

## 📦 Installation

You need to install dependencies for both the **Frontend** (React) and the **Backend** (Node.js).

### 1. Install Frontend Dependencies
Run this in the root folder:
```bash
npm install
```

### 2. Install Backend Dependencies
Navigate to the server folder and install:
```bash
cd server
npm install
cd ..
```

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the **root directory** of the project. You can copy the example:

**Windows**:
```bash
copy .env.example .env
```

**Mac/Linux**:
```bash
cp .env.example .env
```

Open `.env` and verify the settings. For local development, the defaults usually work fine.

---

## ▶️ Running the Application

You need to run **two** separate terminals to start the full application.

### Terminal 1: Start Backend Server
```bash
cd server
npm start
```
*You should see: `Server running on http://localhost:3000`*

### Terminal 2: Start Frontend Application
Open a new terminal window in the root folder:
```bash
npm run dev
```
*You should see: `Local: http://localhost:8080`*

---

## 📱 Connecting from Other Devices

To access the application from your phone or another computer on the same Wi-Fi network:

1.  **Find your Computer's Local IP Address**:
    *   **Windows**: Open Command Prompt and type `ipconfig`. Look for `IPv4 Address` (e.g., `192.168.1.5`).
    *   **Mac/Linux**: Open Terminal and type `ifconfig` or `ip a`.

2.  **Update API Client (Important)**:
    *   Open `src/api/client.ts`.
    *   Change `baseURL` from `http://localhost:3000` to `http://<YOUR_IP_ADDRESS>:3000` (e.g., `http://192.168.1.5:3000`).
    *   *Note: If you don't do this, the frontend on your phone will try to connect to the phone's own localhost, which won't work.*

3.  **Access on Mobile**:
    *   Open your phone's browser.
    *   Type: `http://<YOUR_IP_ADDRESS>:8080` (e.g., `http://192.168.1.5:8080`).

4.  **Troubleshooting**:
    *   **Firewall**: Ensure your computer's firewall allows traffic on ports `3000` and `8080`.
    *   **Same Network**: Ensure both devices are connected to the **same** Wi-Fi network.

---

## 🔄 Resetting the Database

If you want to clear all data and start fresh:
1.  Stop the backend server (Ctrl+C).
2.  Delete the file `server/database.sqlite`.
3.  Restart the backend server (`npm start`).
    *   *The server will automatically recreate and seed the database.*
