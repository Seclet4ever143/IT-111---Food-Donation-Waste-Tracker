from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Q
from .models import FoodCategory, Donation, DonationClaim
from .serializers import (
    FoodCategorySerializer, DonationSerializer, DonationClaimSerializer
)
from accounts.permissions import (
    IsAdmin, IsDonor, IsCharity, IsVerifiedDonor, IsVerifiedCharity,
    IsAdminOrDonor, IsAdminOrCharity, IsAdminOrVerifiedDonor, IsOwnerOrAdmin
)

class FoodCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing food categories."""
    
    queryset = FoodCategory.objects.all()
    serializer_class = FoodCategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

class DonationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing donations."""
    
    serializer_class = DonationSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all donations
        if user.role == 'admin':
            return Donation.objects.all()
        
        # Donor can see their own donations
        elif user.role == 'donor':
            return Donation.objects.filter(donor=user)
        
        # Charity can see available donations and their claimed donations
        elif user.role == 'charity':
            return Donation.objects.filter(
                Q(status=Donation.AVAILABLE) | Q(charity=user)
            )
        
        return Donation.objects.none()
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsVerifiedDonor]  # Only verified donors can create donations
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrAdmin]
        elif self.action in ['claim', 'mark_received']:
            permission_classes = [IsVerifiedCharity]  # Only verified charities can claim donations
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """Create a new donation with verification check."""
        if not request.user.is_verified:
            return Response(
                {"detail": "You must be verified to create donations. Please contact an administrator to verify your account."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[IsVerifiedCharity])
    def claim(self, request, pk=None):
        """Claim a donation."""
        if not request.user.is_verified:
            return Response(
                {"detail": "You must be verified to claim donations. Please contact an administrator to verify your account."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        donation = self.get_object()
        
        # Check if donation is available
        if donation.status != Donation.AVAILABLE:
            return Response(
                {"detail": "This donation is not available for claiming."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
        try:
            # Create a claim
            serializer = DonationClaimSerializer(
                data=request.data,
                context={'request': request}
            )
        
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        
            # Set the donation and save
            serializer.validated_data['donation'] = donation
            claim = serializer.save()
        
            # Update the donation
            donation.status = Donation.CLAIMED
            donation.charity = request.user
            donation.claimed_at = timezone.now()
            donation.save()
        
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error claiming donation: {str(e)}")
            return Response(
                {"detail": f"Error claiming donation: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsVerifiedCharity])
    def mark_received(self, request, pk=None):
        """Mark a donation as received."""
        donation = self.get_object()
        
        # Check if donation is claimed by this charity
        if donation.status != Donation.CLAIMED or donation.charity != request.user:
            return Response(
                {"detail": "You cannot mark this donation as received."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the donation
        donation.status = Donation.RECEIVED
        donation.received_at = timezone.now()
        donation.save()
        
        # Update the claim
        try:
            claim = DonationClaim.objects.get(donation=donation, charity=request.user)
            claim.is_received = True
            claim.received_at = timezone.now()
            claim.save()
        except DonationClaim.DoesNotExist:
            pass
        
        serializer = self.get_serializer(donation)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrDonor])
    def my_donations(self, request):
        """Get the current user's donations."""
        donations = Donation.objects.filter(donor=request.user)
        serializer = self.get_serializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsCharity])
    def available(self, request):
        """Get available donations."""
        donations = Donation.objects.filter(status=Donation.AVAILABLE)
        serializer = self.get_serializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsCharity])
    def claimed(self, request):
        """Get donations claimed by the current charity."""
        donations = Donation.objects.filter(charity=request.user)
        serializer = self.get_serializer(donations, many=True)
        return Response(serializer.data)

class DonationClaimViewSet(viewsets.ModelViewSet):
    """ViewSet for managing donation claims."""
    
    serializer_class = DonationClaimSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all claims
        if user.role == 'admin':
            return DonationClaim.objects.all()
        
        # Donor can see claims for their donations
        elif user.role == 'donor':
            return DonationClaim.objects.filter(donation__donor=user)
        
        # Charity can see their own claims
        elif user.role == 'charity':
            return DonationClaim.objects.filter(charity=user)
        
        return DonationClaim.objects.none()
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsVerifiedCharity]  # Only verified charities can create claims
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'], permission_classes=[IsVerifiedCharity])
    def mark_received(self, request, pk=None):
        """Mark a claim as received."""
        claim = self.get_object()
        
        # Check if claim belongs to this charity
        if claim.charity != request.user:
            return Response(
                {"detail": "You cannot mark this claim as received."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the claim
        claim.is_received = True
        claim.received_at = timezone.now()
        claim.save()
        
        # Update the donation
        donation = claim.donation
        donation.status = Donation.RECEIVED
        donation.received_at = timezone.now()
        donation.save()
        
        serializer = self.get_serializer(claim)
        return Response(serializer.data)
