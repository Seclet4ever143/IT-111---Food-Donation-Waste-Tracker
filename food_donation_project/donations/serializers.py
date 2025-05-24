from rest_framework import serializers
from .models import FoodCategory, Donation, DonationClaim
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class FoodCategorySerializer(serializers.ModelSerializer):
    """Serializer for the FoodCategory model."""
    
    class Meta:
        model = FoodCategory
        fields = ['id', 'name', 'description']

class DonorSerializer(serializers.ModelSerializer):
    """Serializer for donor information in donations."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'city', 'state']

class CharitySerializer(serializers.ModelSerializer):
    """Serializer for charity information in donations."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'organization_name', 'phone_number', 'city', 'state']

class DonationSerializer(serializers.ModelSerializer):
    """Serializer for the Donation model."""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    donor_details = DonorSerializer(source='donor', read_only=True)
    charity_details = CharitySerializer(source='charity', read_only=True)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'donor_details', 'charity', 'charity_details',
            'food_name', 'description', 'quantity', 'category', 'category_name',
            'expiry_date', 'pickup_address', 'pickup_city', 'pickup_state', 
            'pickup_zip', 'pickup_instructions', 'status', 'created_at', 
            'updated_at', 'claimed_at', 'received_at', 'latitude', 'longitude'
        ]
        read_only_fields = ['donor', 'charity', 'status', 'claimed_at', 'received_at']
    
    def create(self, validated_data):
        # Set the donor to the current user
        validated_data['donor'] = self.context['request'].user
        return super().create(validated_data)

class DonationClaimSerializer(serializers.ModelSerializer):
    """Serializer for the DonationClaim model."""
    
    donation_details = DonationSerializer(source='donation', read_only=True)
    charity_details = CharitySerializer(source='charity', read_only=True)
    
    class Meta:
        model = DonationClaim
        fields = [
            'id', 'donation', 'donation_details', 'charity', 'charity_details',
            'claimed_at', 'pickup_time', 'notes', 'is_received', 'received_at'
        ]
        read_only_fields = ['charity', 'claimed_at', 'is_received', 'received_at']
    
    def validate_pickup_time(self, value):
        """Validate that pickup_time is in the future."""
        if value and value < timezone.now():
            raise serializers.ValidationError("Pickup time must be in the future.")
        return value
    
    def create(self, validated_data):
        # Set the charity to the current user
        validated_data['charity'] = self.context['request'].user
        
        # Update the donation status
        donation = validated_data['donation']
        donation.status = Donation.CLAIMED
        donation.charity = validated_data['charity']
        donation.claimed_at = timezone.now()
        donation.save()
        
        return super().create(validated_data)
