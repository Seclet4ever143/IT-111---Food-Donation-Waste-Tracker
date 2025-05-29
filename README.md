# Food Donation & Waste Tracking System

This project is a full-stack web application built using **Django (REST Framework)** for the backend and **React** for the frontend. It supports managing food donations and waste tracking for different user roles like admin, donor, and charity.

---

## 📁 Project Structure

```
IT-111---Food-Donation-Waste-Tracker/
│
├── food_donation_project/   # Django backend
│   ├── manage.py
│   └── ...
│
└── frontend/                # React frontend
    └── ...
```

---

## 🐍 Backend Setup (Django + PostgreSQL)

### 🔧 Step 1: Delete old virtual environment (if exists)

Use PowerShell or delete the `venv` folder manually:

```powershell
Remove-Item -Recurse -Force .\venv
```

---

### 🐍 Step 2: Recreate & activate virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate   # Windows PowerShell
# or
./venv/Scripts/Activate   # Bash
```

---

### 📦 Step 3: Install dependencies

```bash
pip install django djangorestframework django-cors-headers psycopg2-binary
pip install djangorestframework-simplejwt
```

---

### ⚙️ Step 4: Update `settings.py`

Inside `food_donation_project/settings.py`, modify the database settings:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '<your_database_name>',
        'USER': '<your_username>',
        'PASSWORD': '<your_password>',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

### ⚙️ Step 5: Setup database

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

> 📌 Note: Remember the email and password you use for the superuser — this will be your admin account.

---

### ▶️ Run the development server

```bash
python manage.py runserver
```

---

## 🌐 Frontend Setup (React)

### 🧭 Step 1: Navigate to frontend

```bash
cd frontend
```

---

### 📦 Step 2: Install frontend dependencies

```bash
npm install axios react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled formik yup recharts
```

> ❗ If you see the following error:

```plaintext
npm.ps1 cannot be loaded because running scripts is disabled...
```

Run this command first in PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

Then re-run the install command.

---

### ▶️ Step 3: Start the React development server

```bash
npm start
```

---

### 🛠️ Step 4: MUI Grid TypeScript Fix (if needed)

If you encounter issues with `Grid.d.ts`, do the following:

- Navigate to:

```bash
frontend/node_modules/@mui/material/Grid/Grid.d.ts
```

- Locate the last line:

```ts
declare const Grid: OverridableComponent<GridTypeMap>;
```

- Replace it with:

```ts
declare const CustomGrid: OverridableComponent<GridTypeMap>;
export default CustomGrid;
```

---

## 🗃️ Database Initial Data

Use the provided `QUERIES.sql` file to insert initial data.

### Sample Queries:

```sql
-- View all users (admin, donor, charity)
SELECT * FROM accounts_user;

-- View and modify food categories
SELECT * FROM donations_foodcategory;

-- View and modify waste categories
SELECT * FROM waste_tracking_wastecategory;
```

> 🧭 Feel free to explore the database — table names are self-explanatory.

---

## 📌 Notes

- Ensure PostgreSQL is running and credentials match `settings.py`.
- Always activate your virtual environment before running backend commands.
- Be patient during npm installation — it may take time.

---

## ✅ Done!

You can now use and explore the Food Donation & Waste Tracking System 🎉
