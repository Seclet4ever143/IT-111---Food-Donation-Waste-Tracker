from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count
from .models import WasteCategory, WasteLog, WasteReduction
from .serializers import (
    WasteCategorySerializer, WasteLogSerializer, WasteReductionSerializer
)
from accounts.permissions import IsAdmin, IsAdminOrDonor, IsAdminOrVerifiedDonor, IsOwnerOrAdmin

class WasteCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing waste categories."""
    
    queryset = WasteCategory.objects.all()
    serializer_class = WasteCategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

class WasteLogViewSet(viewsets.ModelViewSet):
    """ViewSet for managing waste logs."""
    
    serializer_class = WasteLogSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all waste logs
        if user.role == 'admin':
            return WasteLog.objects.all()
        
        # Other users can see their own waste logs
        return WasteLog.objects.filter(user=user)
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAdminOrVerifiedDonor]  # Only verified donors can create waste logs
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """Create a new waste log with verification check for donors."""
        if request.user.role == 'donor' and not request.user.is_verified:
            return Response(
                {"detail": "You must be verified to log waste. Please contact an administrator to verify your account."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_logs(self, request):
        """Get the current user's waste logs."""
        logs = WasteLog.objects.filter(user=request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def stats(self, request):
        """Get waste statistics for the current user."""
        user = request.user
        
        # Get waste logs for this user
        logs = WasteLog.objects.filter(user=user)
        
        # Calculate statistics
        stats = {
            'total_logs': logs.count(),
            'by_type': logs.values('waste_type').annotate(
                count=Count('id')
            ).order_by('waste_type'),
            'by_category': logs.values('waste_category__name').annotate(
                count=Count('id')
            ).order_by('waste_category__name'),
            'by_month': logs.extra(
                select={'month': "EXTRACT(month FROM date)"}
            ).values('month').annotate(
                count=Count('id')
            ).order_by('month')
        }
        
        return Response(stats)

class WasteReductionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing waste reduction efforts."""
    
    serializer_class = WasteReductionSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all waste reduction efforts
        if user.role == 'admin':
            return WasteReduction.objects.all()
        
        # Other users can see their own waste reduction efforts
        return WasteReduction.objects.filter(user=user)
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAdminOrVerifiedDonor]  # Only verified donors can create waste reduction entries
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """Create a new waste reduction entry with verification check for donors."""
        if request.user.role == 'donor' and not request.user.is_verified:
            return Response(
                {"detail": "You must be verified to log waste reduction efforts. Please contact an administrator to verify your account."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_reductions(self, request):
        """Get the current user's waste reduction efforts."""
        reductions = WasteReduction.objects.filter(user=request.user)
        serializer = self.get_serializer(reductions, many=True)
        return Response(serializer.data)
