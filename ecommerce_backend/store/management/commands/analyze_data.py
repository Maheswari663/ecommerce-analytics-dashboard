from django.core.management.base import BaseCommand
from store.models import Order, OrderItem, Product, Customer
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # GUI లేకుండా images save చేయడానికి
import matplotlib.pyplot as plt
import os

class Command(BaseCommand):
    help = 'Runs analytics on order data using Pandas and generates charts'

    def handle(self, *args, **kwargs):
        # Step 1: Order Items ని Pandas DataFrame గా load చేయి
        order_items = OrderItem.objects.select_related('order', 'product', 'order__customer__user').all()

        data = []
        for item in order_items:
            data.append({
                'order_id': item.order.id,
                'customer': item.order.customer.user.username,
                'product': item.product.name,
                'category': item.product.category.name,
                'quantity': item.quantity,
                'price': float(item.price),
                'total': float(item.price) * item.quantity,
                'status': item.order.status,
                'date': item.order.created_at,
            })

        df = pd.DataFrame(data)

        if df.empty:
            self.stdout.write(self.style.ERROR("No order data found! Add some orders first."))
            return

        # Charts save చేయడానికి folder create చేయి
        output_dir = 'analytics_charts'
        os.makedirs(output_dir, exist_ok=True)

        # ===== Chart 1: Top Selling Products (Bar Chart) =====
        top_products = df.groupby('product')['quantity'].sum().sort_values(ascending=False)
        plt.figure(figsize=(8, 5))
        top_products.plot(kind='bar', color='#4C72B0')
        plt.title('Top Selling Products (by Quantity)')
        plt.xlabel('Product')
        plt.ylabel('Quantity Sold')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/top_products.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"Saved: {output_dir}/top_products.png"))

        # ===== Chart 2: Revenue by Category (Pie Chart) =====
        revenue_by_category = df.groupby('category')['total'].sum()
        plt.figure(figsize=(6, 6))
        plt.pie(revenue_by_category, labels=revenue_by_category.index, autopct='%1.1f%%', startangle=90,
                colors=['#55A868', '#C44E52', '#8172B2', '#CCB974'])
        plt.title('Revenue Share by Category')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/revenue_by_category.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"Saved: {output_dir}/revenue_by_category.png"))

        # ===== Chart 3: Top Customers by Spend (Bar Chart) =====
        top_customers = df.groupby('customer')['total'].sum().sort_values(ascending=False)
        plt.figure(figsize=(8, 5))
        top_customers.plot(kind='bar', color='#DD8452')
        plt.title('Top Customers (by Total Spend)')
        plt.xlabel('Customer')
        plt.ylabel('Total Spend (₹)')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/top_customers.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"Saved: {output_dir}/top_customers.png"))

        # ===== Chart 4: Order Status Breakdown (Pie Chart) =====
        status_counts = df['status'].value_counts()
        plt.figure(figsize=(6, 6))
        plt.pie(status_counts, labels=status_counts.index, autopct='%1.1f%%', startangle=90,
                colors=['#66C2A5', '#FC8D62', '#8DA0CB'])
        plt.title('Order Status Breakdown')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/order_status.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"Saved: {output_dir}/order_status.png"))

        # ===== Chart 5: Revenue Trend Over Time (Line Chart) =====
        df['date_only'] = pd.to_datetime(df['date']).dt.date
        revenue_trend = df.groupby('date_only')['total'].sum()
        plt.figure(figsize=(8, 5))
        revenue_trend.plot(kind='line', marker='o', color='#4C72B0')
        plt.title('Revenue Trend Over Time')
        plt.xlabel('Date')
        plt.ylabel('Revenue (₹)')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/revenue_trend.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"Saved: {output_dir}/revenue_trend.png"))

        self.stdout.write(self.style.SUCCESS(f"\n✅ All charts saved in '{output_dir}' folder!"))