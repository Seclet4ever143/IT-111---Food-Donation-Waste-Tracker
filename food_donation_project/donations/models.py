from django.db import models
from django.conf import settings

class FoodCategory(models.Model):
    """Model for food categories."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Food Categories"

class Donation(models.Model):
    """Model for food donations."""
    
    # Status choices
    AVAILABLE = 'available'
    CLAIMED = 'claimed'
    RECEIVED = 'received'
    EXPIRED = 'expired'
    
    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (CLAIMED, 'Claimed'),
        (RECEIVED, 'Received'),
        (EXPIRED, 'Expired'),
    ]
    
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='donations'
    )
    charity = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='claimed_donations',
        null=True, 
        blank=True
    )
    food_name = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.CharField(max_length=100)
    category = models.ForeignKey(
        FoodCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='donations'
    )
    expiry_date = models.DateField()
    pickup_address = models.TextField()
    pickup_city = models.CharField(max_length=100)
    pickup_state = models.CharField(max_length=100)
    pickup_zip = models.CharField(max_length=10)
    pickup_instructions = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=AVAILABLE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    claimed_at = models.DateTimeField(null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    
    # For geolocation
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    def __str__(self):
        return f"{self.food_name} by {self.donor.email}"
    
    class Meta:
        ordering = ['-created_at']

class DonationClaim(models.Model):
    """Model for tracking donation claims."""
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE, related_name='claims')
    charity = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='claims'
    )
    claimed_at = models.DateTimeField(auto_now_add=True)
    pickup_time = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    is_received = models.BooleanField(default=False)
    received_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Claim for {self.donation.food_name} by {self.charity.email}"
    
    class Meta:
        ordering = ['-claimed_at']
        unique_together = ['donation', 'charity']