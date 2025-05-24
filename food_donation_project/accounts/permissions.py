from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsDonor(permissions.BasePermission):
    """
    Permission to only allow donor users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'donor'

class IsVerifiedDonor(permissions.BasePermission):
    """
    Permission to only allow verified donor users to access the view.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role == 'donor' and 
                request.user.is_verified)

class IsCharity(permissions.BasePermission):
    """
    Permission to only allow charity users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'charity'

class IsVerifiedCharity(permissions.BasePermission):
    """
    Permission to only allow verified charity users to access the view.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role == 'charity' and 
                request.user.is_verified)

class IsAdminOrDonor(permissions.BasePermission):
    """
    Permission to allow admin or donor users to access the view.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'donor']

class IsAdminOrVerifiedDonor(permissions.BasePermission):
    """
    Permission to allow admin or verified donor users to access the view.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'admin':
            return True
        return request.user.role == 'donor' and request.user.is_verified

class IsAdminOrCharity(permissions.BasePermission):
    """
    Permission to allow admin or charity users to access the view.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'charity']

class IsAdminOrVerifiedCharity(permissions.BasePermission):
    """
    Permission to allow admin or verified charity users to access the view.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'admin':
            return True
        return request.user.role == 'charity' and request.user.is_verified

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        # Admin can access any object
        if request.user.role == 'admin':
            return True
            
        # Check if the object has a user or donor field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'donor'):
            return obj.donor == request.user
        
        return False
