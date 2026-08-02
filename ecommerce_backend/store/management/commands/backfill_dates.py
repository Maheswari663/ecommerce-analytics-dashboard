from django.core.management.base import BaseCommand
from store.models import Order
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Spreads existing order dates across the past 10 days (for demo/prediction purposes)'

    def handle(self, *args, **kwargs):
        orders = list(Order.objects.all())

        if not orders:
            self.stdout.write(self.style.ERROR("No orders found!"))
            return

        today = timezone.now()

        for i, order in enumerate(orders):
            days_ago = random.randint(0, 9) 
            new_date = today - timezone.timedelta(days=days_ago, hours=random.randint(0, 23))
            Order.objects.filter(id=order.id).update(created_at=new_date)

        self.stdout.write(self.style.SUCCESS(f"Updated dates for {len(orders)} orders across past 10 days!"))