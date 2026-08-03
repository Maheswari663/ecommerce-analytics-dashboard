from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates or updates a default superuser'

    def handle(self, *args, **kwargs):
        username = 'admin'
        password = 'Admin@1234'

        user, created = User.objects.get_or_create(username=username, defaults={'email': 'admin@example.com'})
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created successfully!'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Existing user "{username}" updated to superuser!'))