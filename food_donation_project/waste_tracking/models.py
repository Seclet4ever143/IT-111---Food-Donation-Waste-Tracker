from django.db import models
from django.conf import settings
from donations.models import FoodCategory

class WasteCategory(models.Model):
    """Model for waste categories."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Waste Categories"

class WasteLog(models.Model):
    """Model for tracking food waste."""
    
    # Waste type choices
    SPOILED = 'spoiled'
    EXPIRED = 'expired'
    LEFTOVERS = 'leftovers'
    OTHER = 'other'
    
    WASTE_TYPE_CHOICES = [
        (SPOILED, 'Spoiled'),
        (EXPIRED, 'Expired'),
        (LEFTOVERS, 'Leftovers'),
        (OTHER, 'Other'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='waste_logs'
    )
    food_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    quantity = models.CharField(max_length=100)
    waste_type = models.CharField(max_length=10, choices=WASTE_TYPE_CHOICES)
    waste_category = models.ForeignKey(
        WasteCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='waste_logs'
    )
    food_category = models.ForeignKey(
        FoodCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='waste_logs'
    )
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.food_name} waste by {self.user.email}"
    
    class Meta:
        ordering = ['-date']

class WasteReduction(models.Model):
    """Model for tracking waste reduction efforts."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='waste_reductions'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    amount_saved = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} by {self.user.email}"
    
    class Meta:
        ordering = ['-date']