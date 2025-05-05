# 🐞 Bug Tracking System

A full-stack **Bug Tracking Web Application** built using the **MERN stack** with integrated **Machine Learning** for severity prediction and developer recommendation.

---

## 🚀 Features

- 🔐 **Role-Based Authentication**
  - Admin, Developer, Tester, and Project Manager roles
- 🛠️ **Project Management**
  - Add, assign, and manage projects
  - Email notifications sent to assigned users
- 🐛 **Bug Management**
  - Report, track, reassign, and resolve bugs
  - AI-powered developer recommendation and severity prediction using a Random Forest model
- 📊 **Dashboard Views**
  - Custom dashboards for Managers and Admins
  - Visual status of projects, bugs, and team assignments
- 📩 **User Onboarding via Email**
  - Nodemailer integration for sending default credentials to new users
- 🔢 **Auto-Incremented Unique IDs**
  - Managed via a centralized MongoDB `Counter` schema

---

## 🧑‍💻 Tech Stack

| Frontend        | Backend              | Database | Machine Learning               | Tools                         |
|----------------|----------------------|----------|-------------------------------|-------------------------------|
| React (Vite)   | Node.js, Express.js  | MongoDB  | Python (Random Forest Classifier) | Nodemailer, Git, VS Code      |

---

## 📂 Folder Structure

```
bug-tracking-system/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
├── ml/
│   └── bug_predictor.py
```

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bug-tracking-system.git
cd bug-tracking-system
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create a `.env` file and add MongoDB URI and email credentials
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Machine Learning Server (Optional if integrated via API)

```bash
cd ../ml
# Ensure Python 3 and dependencies (pandas, sklearn, flask) are installed
python bug_predictor.py
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## ✉️ Email Integration

Emails are sent to Developers, Testers, and Project Managers upon being invited using **Nodemailer**. Each email includes default credentials and login instructions.

---

## 📈 AI-Powered Features

- Trained a **Random Forest Classifier** on historical bug data.
- Predicts:
  - Bug Severity (Low, Medium, High)
  - Best-suited Developer (based on bug type and past resolution data)

---

## 🛡️ Security

- Passwords stored using bcrypt hashing
- Role-based access control for API endpoints and frontend views

---

## 🤝 Contributors

- **Diya**
- **Anjali** 
- **Anugraha** 

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 📸 Screenshots
![WhatsApp Image 2025-05-05 at 16 37 51_d4327f3a](https://github.com/user-attachments/assets/9c08eb89-cc46-4c89-8179-9b6608f91256)
![Screenshot 2025-03-11 230831](https://github.com/user-attachments/assets/e35aecbc-2721-4348-b0bc-27b5e943c839)
![Screenshot 2025-03-11 230802](https://github.com/user-attachments/assets/5555aad2-5602-4fce-b55b-7755727bc570)
![Screenshot 2025-03-11 230733](https://github.com/user-attachments/assets/90582c44-5311-4d75-b6a5-cd1296512cc9)

!![Screenshot 2025-03-11 230822](https://github.com/user-attachments/assets/b002500d-0c09-4d42-83a2-0f4f24aa3998)
[Screenshot 2025-03-11 230840](https://github.com/user-attachments/assets/301bd8cf-2bcb-443d-aeba-c8632bbb1bc9)
![Scree![Uploading Screenshot 2025-03-11 230840.png…]()
nshot 2025-04-07 130803](https://github.com/user-attachments/assets/6fa85909-f681-4c24-aa47-9be9fab4a679)
![Screenshot 2025-03-11 231135](https://github.com/user-attachments/assets/a99c900f-a9fb-4656-b864-c30469356ada)
![Screenshot 2025-04-07 131014](https://github.com/user-attachments/assets/9d16e04f-9d47-46e5-9dd5-1403bf0f9606)

![Screenshot 2025-04-07 131043](https://github.com/user-attachments/assets/f22b902d-1ede-4860-a0fc-6b885ff58fdf)

![Screenshot 2025-04-07 131749](https://github.com/user-attachments/assets/2a77538e-113a-47d0-93e3-60b1e62ebe3c)

![Screenshot 2025-04-07 130849](https://github.com/user-attachments/assets/62998da7-ba1b-41bb-984c-eb0f9ed7b9c3)





![Screenshot 2025-03-11 231322](https://github.com/user-attachments/assets/d9ae79e3-f6de-4a90-9ba2-0cf8659443df)
