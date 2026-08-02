from django.shortcuts import render
import pandas as pd
from datetime import datetime,timezone as dt_timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from sklearn.linear_model import LinearRegression
import numpy as np
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Category, Product, Customer, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CustomerSerializer,
    OrderSerializer, OrderItemSerializer
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

@api_view(['GET'])
def dashboard_analytics(request):
    # Top Selling Products (by quantity)
    top_products = (
        OrderItem.objects.values('product__name')
        .annotate(total_quantity=Sum('quantity'))
        .order_by('-total_quantity')[:5]
    )

    # Revenue by Category
    revenue_by_category = (
        OrderItem.objects.values('product__category__name')
        .annotate(total_revenue=Sum('price'))
        .order_by('-total_revenue')
    )

    # Order Status Breakdown
    status_breakdown = (
        Order.objects.values('status')
        .annotate(count=Count('id'))
    )

    # Total Revenue (completed orders only)
    total_revenue = (
        OrderItem.objects.filter(order__status='completed')
        .aggregate(total=Sum('price'))['total'] or 0
    )

    data = {
        'top_products': [
            {'name': item['product__name'], 'quantity': item['total_quantity']}
            for item in top_products
        ],
        'revenue_by_category': [
            {'category': item['product__category__name'], 'revenue': float(item['total_revenue'])}
            for item in revenue_by_category
        ],
        'status_breakdown': [
            {'status': item['status'], 'count': item['count']}
            for item in status_breakdown
        ],
        'total_revenue': float(total_revenue),
    }

    return Response(data)   

@api_view(['GET'])
def rfm_segments(request):
    orders = Order.objects.filter(status='completed').select_related('customer__user')

    data = []
    for order in orders:
        order_total = sum(item.price * item.quantity for item in order.items.all())
        data.append({
            'customer': order.customer.user.username,
            'order_id': order.id,
            'date': order.created_at,
            'total': float(order_total),
        })

    df = pd.DataFrame(data)

    if df.empty:
        return Response({'segments': [], 'summary': []})

    today = datetime.now(dt_timezone.utc)
    df['date'] = pd.to_datetime(df['date'])

    rfm = df.groupby('customer').agg(
        recency=('date', lambda x: (today - x.max()).days),
        frequency=('order_id', 'count'),
        monetary=('total', 'sum')
    ).reset_index()

    rfm['R_score'] = pd.qcut(rfm['recency'], q=min(4, rfm['recency'].nunique()), labels=False, duplicates='drop')
    rfm['R_score'] = rfm['R_score'].max() - rfm['R_score']
    rfm['F_score'] = pd.qcut(rfm['frequency'].rank(method='first'), q=min(4, rfm['frequency'].nunique()), labels=False, duplicates='drop')
    rfm['M_score'] = pd.qcut(rfm['monetary'], q=min(4, rfm['monetary'].nunique()), labels=False, duplicates='drop')
    rfm['RFM_score'] = rfm['R_score'] + rfm['F_score'] + rfm['M_score']

    def segment_customer(score):
        if score >= 6:
            return 'Champion / High Value'
        elif score >= 4:
            return 'Loyal Customer'
        elif score >= 2:
            return 'At Risk'
        else:
            return 'Lost Customer'

    rfm['segment'] = rfm['RFM_score'].apply(segment_customer)
    rfm = rfm.sort_values('RFM_score', ascending=False)

    segments_list = rfm[['customer', 'recency', 'frequency', 'monetary', 'RFM_score', 'segment']].to_dict('records')
    summary = rfm['segment'].value_counts().reset_index()
    summary.columns = ['segment', 'count']
    summary_list = summary.to_dict('records')

    return Response({'segments': segments_list, 'summary': summary_list})

@api_view(['GET'])
def sales_prediction(request):
    orders = Order.objects.filter(status='completed').select_related().prefetch_related('items')

    data = []
    for order in orders:
        order_total = sum(item.price * item.quantity for item in order.items.all())
        data.append({
            'date': order.created_at.date(),
            'total': float(order_total),
        })

    df = pd.DataFrame(data)

    if df.empty or len(df) < 3:
        return Response({
            'error': 'Not enough data for prediction. Need at least 3 completed orders on different dates.',
            'actual': [],
            'predicted': [],
        })

    # రోజువారీగా revenue కలపడం (group by date)
    daily_revenue = df.groupby('date')['total'].sum().reset_index()
    daily_revenue = daily_revenue.sort_values('date')

    if len(daily_revenue) < 2:
        return Response({
            'error': 'Not enough unique dates for prediction. Need sales data across multiple days.',
            'actual': daily_revenue.to_dict('records'),
            'predicted': [],
        })

    # Dates ని numbers గా convert చేయడం (Day 0, Day 1, Day 2...) — model కి ఇవ్వడానికి
    daily_revenue['day_number'] = (daily_revenue['date'] - daily_revenue['date'].min()).apply(lambda x: x.days)

    X = daily_revenue[['day_number']].values
    y = daily_revenue['total'].values

    model = LinearRegression()
    model.fit(X, y)

    # రాబోయే 7 రోజుల కోసం prediction
    last_day = daily_revenue['day_number'].max()
    future_days = np.array([[last_day + i] for i in range(1, 8)])
    predictions = model.predict(future_days)
    predictions = [max(0, round(p, 2)) for p in predictions]  # negative values ఉండకూడదు

    from datetime import timedelta
    last_date = daily_revenue['date'].max()
    future_dates = [(last_date + timedelta(days=i)).isoformat() for i in range(1, 8)]

    actual_data = [
        {'date': row['date'].isoformat(), 'revenue': row['total']}
        for _, row in daily_revenue.iterrows()
    ]

    predicted_data = [
        {'date': future_dates[i], 'revenue': predictions[i]}
        for i in range(len(predictions))
    ]

    return Response({
        'actual': actual_data,
        'predicted': predicted_data,
        'trend': 'increasing' if model.coef_[0] > 0 else 'decreasing',
    })

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'is_staff': user.is_staff,
        })
    else:
        return Response({'error': 'Invalid username or password'}, status=400)


from django.contrib.auth.models import User
from django.db import IntegrityError


@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    phone = request.data.get('phone', '')
    address = request.data.get('address', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    if len(password) < 4:
        return Response({'error': 'Password must be at least 4 characters'}, status=400)

    try:
        user = User.objects.create_user(username=username, password=password)
        Customer.objects.create(user=user, phone=phone, address=address)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'username': user.username,
            'is_staff': user.is_staff,
        })
    except IntegrityError:
        return Response({'error': 'Username already exists'}, status=400)    