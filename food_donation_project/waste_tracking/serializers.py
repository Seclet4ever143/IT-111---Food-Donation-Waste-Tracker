from rest_framework import serializers
from .models import WasteCategory, WasteLog, WasteReduction
from donations.serializers import FoodCategorySerializer

class WasteCategorySerializer(serializers.ModelSerializer):
    """Serializer for the WasteCategory model."""
    
    class Meta:
        model = WasteCategory
        fields = ['id', 'name', 'description']

class WasteLogSerializer(serializers.ModelSerializer):
    """Serializer for the WasteLog model."""
    
    waste_category_name = serializers.CharField(source='waste_category.name', read_only=True)
    food_category_name = serializers.CharField(source='food_category.name', read_only=True)
    
    class Meta:
        model = WasteLog
        fields = [
            'id', 'user', 'food_name', 'description', 'quantity', 
            'waste_type', 'waste_category', 'waste_category_name',
            'food_category', 'food_category_name', 'date', 
            'created_at', 'updated_at', 'notes'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set the user to the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class WasteReductionSerializer(serializers.ModelSerializer):
    """Serializer for the WasteReduction model."""
    
    class Meta:
        model = WasteReduction
        fields = [
            'id', 'user', 'title', 'description', 
            'amount_saved', 'date', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']
    
    def create(self, validated_data):
        # Set the user to the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)