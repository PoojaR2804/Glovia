# GLOVIA — Skincare E-Commerce Website

GLOVIA is a full-stack skincare e-commerce web application designed to provide a simple and user-friendly online shopping experience. Users can explore skincare products, manage their wishlist and cart, place orders, and track their purchases.

## Live Demo

- **Live Website:** https://glovia-kohl.vercel.app/
- **GitHub Repository:** https://github.com/PoojaR2804/Glovia


## Features

- Browse skincare products and categories
- View product details and prices
- User registration and login
- Add and remove products from the shopping cart
- Manage wishlist items
- Checkout and place orders
- View previous orders
- Track order details
- Manage user profile

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Python
- Django
- Django REST Framework
- REST API

### Database
- SQLite for local development
- Production database configuration planned

### Deployment
- Vercel — Frontend
- Render — Backend deployment planned

## Project Structure

```text
glovia/
├── backend/
│   ├── config/
│   ├── products/
│   ├── manage.py
│   └── requirements.txt
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── data/
│   └── pages/
├── public/
├── package.json
└── README.md
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/PoojaR2804/Glovia.git
cd Glovia
```

### 2. Start the frontend

```bash
npm install
npm run dev
```

### 3. Start the backend

Open another terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies once `requirements.txt` is available:

```bash
pip install -r requirements.txt
```

Apply database migrations:

```bash
python manage.py migrate
```

Start Django:

```bash
python manage.py runserver
```

The local frontend and backend will run on their respective development URLs. API requests must be configured to point to the appropriate backend URL.

## Future Improvements

- Complete production backend deployment
- Configure a persistent production database
- Integrate a secure payment gateway
- Improve product search and filtering
- Enhance order and delivery management

## Author

**Pooja R.**

Developed as a full-stack web development project.

---

*GLOVIA — Your skincare shopping experience, simplified.*
