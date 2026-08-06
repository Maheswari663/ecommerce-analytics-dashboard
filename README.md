
# 📊 E-commerce Analytics Dashboard

A full-stack e-commerce analytics platform built with **Django REST Framework** and **React**, featuring real-time business intelligence, customer segmentation, and sales forecasting.

---

## 🌟 Features

### 🔐 Authentication & Access Control
- Token-based authentication (Login / Register)
- Role-based access control — Admin/Staff users see the full analytics dashboard, regular customers see a simple welcome page

### 📈 Analytics Dashboard
- Total revenue tracking (completed orders)
- Top-selling products (bar chart)
- Revenue breakdown by category (pie chart)
- Order status breakdown (pie chart)

### 🎯 RFM Customer Segmentation
- Recency, Frequency, Monetary analysis using **Pandas**
- Automatic customer segmentation: Champion, Loyal Customer, At Risk, Lost Customer
- Visual segment distribution + detailed customer table

### 🤖 Sales Prediction (Machine Learning)
- Linear Regression model (scikit-learn) trained on historical daily revenue
- 7-day future revenue forecast
- Actual vs. Predicted trend visualization

### 📦 Product Catalog
- Product cards with images, pricing, and stock status
- Real-time search by product name
- Category-based filtering

### 🛠️ Admin Panel
- Full CRUD management for Categories, Products, Customers, Orders, and Order Items via Django Admin

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Django, Django REST Framework |
| **Frontend** | React, React Router |
| **Data Analytics** | Pandas, NumPy |
| **Machine Learning** | scikit-learn (Linear Regression) |
| **Visualization** | Recharts (React), Matplotlib (Python) |
| **Database** | SQLite |
| **Authentication** | DRF Token Authentication |

---

## 📂 Project Structure

```
ecommerce DA P/
├── ecommerce_backend/          # Django project
│   ├── store/
│   │   ├── models.py           # Category, Product, Customer, Order, OrderItem
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API views (CRUD + analytics endpoints)
│   │   ├── urls.py             # API routing
│   │   ├── admin.py            # Admin panel registration
│   │   └── management/
│   │       └── commands/       # Custom scripts (analyze_data, rfm_analysis, etc.)
│   └── manage.py
│
└── ecommerce-frontend/         # React app
    └── src/
        ├── Dashboard.js        # Analytics dashboard (charts)
        ├── RFMSegments.js      # Customer segmentation view
        ├── SalesPrediction.js  # ML forecast view
        ├── ProductList.js      # Product catalog with search/filter
        ├── Login.js / Register.js
        ├── Welcome.js          # Customer landing page
        ├── api.js              # Axios instance with token handling
        └── App.js              # Routing + role-based access logic
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/categories/` | GET, POST | List/create categories |
| `/api/products/` | GET, POST | List/create products |
| `/api/customers/` | GET, POST | List/create customers |
| `/api/orders/` | GET, POST | List/create orders |
| `/api/order-items/` | GET, POST | List/create order items |
| `/api/dashboard-analytics/` | GET | Revenue, top products, category & status breakdown |
| `/api/rfm-segments/` | GET | RFM scores and customer segments |
| `/api/sales-prediction/` | GET | ML-based 7-day revenue forecast |
| `/api/login/` | POST | Authenticate and receive a token |
| `/api/register/` | POST | Create a new customer account |

---

## ⚙️ Setup Instructions

### Backend (Django)

```bash
cd ecommerce_backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install django djangorestframework pandas scikit-learn matplotlib Pillow django-cors-headers

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`

### Frontend (React)

```bash
cd ecommerce-frontend
npm install
npm install axios recharts react-router-dom
npm start
```

Frontend runs at `http://localhost:3000/`

---

## 📊 Data Analytics Scripts

Custom Django management commands for offline analysis (in addition to the live API):

```bash
python manage.py analyze_data      # Pandas analytics + Matplotlib charts
python manage.py rfm_analysis      # RFM segmentation + charts
```

Charts are saved to `ecommerce_backend/analytics_charts/`.

---

## 🎓 Key Concepts Demonstrated

- RESTful API design with Django REST Framework
- Data analysis and aggregation using Pandas (groupby, pivot-style summaries)
- Customer segmentation using the RFM (Recency, Frequency, Monetary) model
- Basic predictive modeling with Linear Regression
- Token-based authentication and role-based authorization
- React state management, routing, and API integration
- Responsive data visualization with Recharts

---

## 🚀 Future Enhancements

- Product recommendation engine (collaborative filtering)
- Order placement flow for customers (cart, checkout)
- Deployment to a live hosting platform
- Date-range filters for analytics dashboard

---

## 👤 Author

Built as a personal project to demonstrate full-stack development combined with practical data analytics — showcasing Django, React, Pandas, and scikit-learn working together in a single application.



login:name=admin,passward=Admin@1234
