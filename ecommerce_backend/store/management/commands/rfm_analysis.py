from django.core.management.base import BaseCommand
from store.models import Order, OrderItem
import pandas as pd
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
import os
from datetime import datetime, timezone

class Command(BaseCommand):
    help = 'Performs RFM (Recency, Frequency, Monetary) analysis on customers'

    def handle(self, *args, **kwargs):
        # Step 1: Order + OrderItem data ని load చేయి (completed orders మాత్రమే)
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
            self.stdout.write(self.style.ERROR("No completed orders found! RFM needs completed order data."))
            return

        # Step 2: Recency, Frequency, Monetary calculate చేయి
        today = datetime.now(timezone.utc)
        df['date'] = pd.to_datetime(df['date'])

        rfm = df.groupby('customer').agg(
            recency=('date', lambda x: (today - x.max()).days),
            frequency=('order_id', 'count'),
            monetary=('total', 'sum')
        ).reset_index()

        self.stdout.write(self.style.SUCCESS("\n=== RAW RFM VALUES ===\n"))
        self.stdout.write(str(rfm))

        # Step 3: Score చేయి (1-4 scale, 4 = best)
        # Recency: తక్కువ days = better (score ఎక్కువ)
        rfm['R_score'] = pd.qcut(rfm['recency'], q=min(4, rfm['recency'].nunique()), labels=False, duplicates='drop')
        rfm['R_score'] = rfm['R_score'].max() - rfm['R_score']  # invert చేయి (తక్కువ recency = ఎక్కువ score)

        # Frequency: ఎక్కువ orders = better
        rfm['F_score'] = pd.qcut(rfm['frequency'].rank(method='first'), q=min(4, rfm['frequency'].nunique()), labels=False, duplicates='drop')

        # Monetary: ఎక్కువ spend = better
        rfm['M_score'] = pd.qcut(rfm['monetary'], q=min(4, rfm['monetary'].nunique()), labels=False, duplicates='drop')

        rfm['RFM_score'] = rfm['R_score'] + rfm['F_score'] + rfm['M_score']

        # Step 4: Segment కి assign చేయి
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

        self.stdout.write(self.style.SUCCESS("\n\n=== RFM ANALYSIS RESULTS ===\n"))
        self.stdout.write(str(rfm[['customer', 'recency', 'frequency', 'monetary', 'RFM_score', 'segment']]))

        # Step 5: Segment-wise summary
        self.stdout.write(self.style.SUCCESS("\n\n=== CUSTOMER SEGMENTS SUMMARY ===\n"))
        segment_summary = rfm['segment'].value_counts()
        self.stdout.write(str(segment_summary))

        # Step 5: Segment-wise summary
        self.stdout.write(self.style.SUCCESS("\n\n=== CUSTOMER SEGMENTS SUMMARY ===\n"))
        segment_summary = rfm['segment'].value_counts()
        self.stdout.write(str(segment_summary))

        # Step 6: Charts save చేయడానికి folder create చేయి
        output_dir = 'analytics_charts'
        os.makedirs(output_dir, exist_ok=True)

        # ===== Chart 1: Segment-wise Customer Count (Bar Chart) =====
        plt.figure(figsize=(7, 5))
        segment_summary.plot(kind='bar', color='#8172B2')
        plt.title('Customer Segments (RFM Analysis)')
        plt.xlabel('Segment')
        plt.ylabel('Number of Customers')
        plt.xticks(rotation=30, ha='right')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/rfm_segments.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"\nSaved: {output_dir}/rfm_segments.png"))

        # ===== Chart 2: Customer-wise RFM Score (Bar Chart, color by segment) =====
        rfm_sorted = rfm.sort_values('RFM_score', ascending=False)
        segment_colors = {
            'Champion / High Value': '#55A868',
            'Loyal Customer': '#4C72B0',
            'At Risk': '#DD8452',
            'Lost Customer': '#C44E52',
        }
        colors = rfm_sorted['segment'].map(segment_colors)

        plt.figure(figsize=(8, 5))
        plt.bar(rfm_sorted['customer'], rfm_sorted['RFM_score'], color=colors)
        plt.title('Customer-wise RFM Score')
        plt.xlabel('Customer')
        plt.ylabel('RFM Score')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/rfm_customer_scores.png')
        plt.close()
        self.stdout.write(self.style.SUCCESS(f"Saved: {output_dir}/rfm_customer_scores.png"))

        self.stdout.write(self.style.SUCCESS(f"\n✅ RFM charts saved in '{output_dir}' folder!"))