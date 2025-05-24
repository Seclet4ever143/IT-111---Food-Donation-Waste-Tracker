from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 
            'phone_number', 'address', 'city', 'state', 'zip_code',
            'organization_name', 'organization_description', 'is_verified',
            'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'is_verified']

class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer for admin users with additional fields."""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 
            'phone_number', 'address', 'city', 'state', 'zip_code',
            'organization_name', 'organization_description', 'is_verified',
            'date_joined', 'is_active', 'is_staff', 'is_superuser'
        ]

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password2', 'first_name', 'last_name', 'role',
            'phone_number', 'address', 'city', 'state', 'zip_code',
            'organization_name', 'organization_description'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate organization name for charities
        if attrs.get('role') == 'charity' and not attrs.get('organization_name'):
            raise serializers.ValidationError({"organization_name": "Organization name is required for charities."})
            
        return attrs
    
    def create(self, validated_data):
        # Remove password2 from the data
        validated_data.pop('password2', None)
        
        # Create the user
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs