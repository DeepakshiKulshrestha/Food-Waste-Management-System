# 🍱 FWMS – Food Waste Management System

## 📌 Overview
FWMS (Food Waste Management System) is a full-stack web application designed to manage and track surplus food donations efficiently. It connects donors, volunteers, and NGOs to ensure that excess food is collected and distributed instead of being wasted.

---

## 🚀 Features
- Add food donations with expiry tracking  
- Assign volunteers for pickup  
- Distribute food to NGOs  
- Automatic status updates using database triggers  
- Dashboard with real-time statistics  
- Reports for analysis (pending donations, total food, etc.)

---

## 🏗️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MySQL (Workbench)
- Triggers & Stored Procedures

---

## 🗄️ Database Tables
- Donor  
- NGO  
- Volunteer  
- Food_Donation  
- Pickup  
- Distribution  

---

## 🔄 Workflow
Donor → Food Donation → Pickup → Distribution → NGO

---

## ⚙️ Database Scripts
Located in the `/database` folder:

- 01_create_tables.sql → Table creation  
- 02_triggers.sql → Triggers for status updates  
- 03_procedures.sql → Stored procedures  
- 04_insert_data.sql → Sample data  
- 05_analysis_queries.sql → Analysis queries  

---

## 🔥 Key Concept (Triggers)
- When a pickup is recorded → status becomes **Picked**  
- When distribution is recorded → status becomes **Distributed**  

This automates the workflow without manual updates.

---

## 🖥️ How to Run the Project

### 1. Database Setup
Run SQL files in order:
01_create_tables.sql  
02_triggers.sql  
03_procedures.sql  
04_insert_data.sql  

---

### 2. Backend Setup
cd backend  
npm install  
node server.js  

Server runs on:  
http://localhost:5000  

---

### 3. Frontend Setup
cd frontend  
npm install  
npm run dev  

Open:  
http://localhost:5173  

---

## 📊 Example Functionalities
- Assign pickup → inserts into Pickup table → trigger updates status  
- Distribute food → inserts into Distribution table → trigger updates status  
- Dashboard shows real-time donation data  

---

## 🎯 Future Improvements
- User authentication (Admin/NGO login)  
- Notification system  
- Mobile app version  
- Map-based tracking  

---

## 👩‍💻 Author
Deepakshi  

---

## ⭐ Conclusion
FWMS demonstrates how full-stack development with MySQL triggers can be used to efficiently manage and reduce food wastage.