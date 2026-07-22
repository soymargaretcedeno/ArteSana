// Local Database for User Management
class LocalDatabase {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    // Initialize with sample users
    loadUsers() {
        const storedUsers = localStorage.getItem('artesana_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }

        // Sample users
        const sampleUsers = [
            {
                id: 1,
                name: 'Ana Diaz',
                email: 'ana@artesana.com',
                password: '123456',
                role: 'artisan',
                twoFactorEnabled: true,
                twoFactorCode: '123456',
                store: 'Ana\'s Handcrafts',
                avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                joinDate: '2024-01-15',
                products: 12,
                rating: 4.8
            },
            {
                id: 2,
                name: 'Carlos Perez',
                email: 'carlos@artesana.com',
                password: '123456',
                role: 'customer',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                joinDate: '2024-02-20',
                orders: 5,
                favorites: 8
            },
            {
                id: 3,
                name: 'Maria Gonzalez',
                email: 'maria@artesana.com',
                password: '123456',
                role: 'artisan',
                store: 'Maria\'s Traditional Crafts',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                joinDate: '2024-01-10',
                products: 8,
                rating: 4.9
            },
            {
                id: 4,
                name: 'Roberto Silva',
                email: 'roberto@artesana.com',
                password: '123456',
                role: 'customer',
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                joinDate: '2024-03-05',
                orders: 3,
                favorites: 12
            },
            {
                id: 5,
                name: 'Isabella Torres',
                email: 'isabella@artesana.com',
                password: '123456',
                role: 'artisan',
                store: 'Isabella\'s Art Gallery',
                avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
                joinDate: '2024-01-25',
                products: 15,
                rating: 4.7
            }
        ];

        // Save to localStorage
        localStorage.setItem('artesana_users', JSON.stringify(sampleUsers));
        return sampleUsers;
    }

    // Load current user from localStorage
    loadCurrentUser() {
        const currentUser = localStorage.getItem('artesana_current_user');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    // Save current user to localStorage
    saveCurrentUser(user) {
        localStorage.setItem('artesana_current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear current user
    clearCurrentUser() {
        localStorage.removeItem('artesana_current_user');
        this.currentUser = null;
    }

    // Authenticate user (2FA: si twoFactorEnabled, requiere verificación adicional)
    authenticate(email, password, twoFactorCode) {
        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return { success: false, requires2FA: true, userId: user.id };
            }
            // API: POST /api/auth/verify-2fa — validar TOTP/código en servidor
            const expectedCode = user.twoFactorCode || '123456';
            if (String(twoFactorCode).trim() !== expectedCode) {
                return { success: false, message: 'Invalid verification code' };
            }
        }

        const { password: _pw, twoFactorCode: _code, ...userWithoutPassword } = user;
        this.saveCurrentUser(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
    }

    // API: POST /api/auth/enable-2fa
    enableTwoFactor(userId, code) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return { success: false, message: 'User not found' };
        this.users[userIndex].twoFactorEnabled = true;
        this.users[userIndex].twoFactorCode = code || '123456';
        localStorage.setItem('artesana_users', JSON.stringify(this.users));
        return { success: true };
    }

    // Register new user
    register(userData) {
        // Check if email already exists
        const existingUser = this.users.find(u => 
            u.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'customer', // Default role
            avatar: null, // No avatar by default for new users
            joinDate: new Date().toISOString().split('T')[0],
            orders: 0,
            favorites: 0
        };

        // Add to users array
        this.users.push(newUser);
        localStorage.setItem('artesana_users', JSON.stringify(this.users));

        // Auto-login the new user
        const { password, ...userWithoutPassword } = newUser;
        this.saveCurrentUser(userWithoutPassword);

        return { success: true, user: userWithoutPassword };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Logout user
    logout() {
        this.clearCurrentUser();
        return { success: true };
    }

    // Update user profile
    updateProfile(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Update user data
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        localStorage.setItem('artesana_users', JSON.stringify(this.users));

        // Update current user if it's the same user
        if (this.currentUser && this.currentUser.id === userId) {
            const { password, ...userWithoutPassword } = this.users[userIndex];
            this.saveCurrentUser(userWithoutPassword);
        }

        return { success: true, user: this.users[userIndex] };
    }

    // Get user by ID
    getUserById(id) {
        return this.users.find(u => u.id === id);
    }

    // Get all users (for admin purposes)
    getAllUsers() {
        return this.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    // Reset database to sample data
    resetToSampleData() {
        localStorage.removeItem('artesana_users');
        localStorage.removeItem('artesana_current_user');
        this.users = this.loadUsers();
        this.currentUser = null;
    }
}

// Create global instance
window.localDB = new LocalDatabase();

// Export for use in other modules
window.LocalDatabase = LocalDatabase;

(function loadSupabaseAuth() {
    if (window.supabaseAuth || document.querySelector('script[src="js/supabase-auth.js"]')) return;

    function loadAuthScript() {
        const authScript = document.createElement('script');
        authScript.src = 'js/supabase-auth.js';
        authScript.onerror = () => console.error('[ArteSana] No se pudo cargar js/supabase-auth.js');
        document.head.appendChild(authScript);
    }

    if (window.supabase) {
        loadAuthScript();
        return;
    }

    const supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    supabaseScript.onload = loadAuthScript;
    supabaseScript.onerror = () => console.error('[ArteSana] No se pudo cargar la librería de Supabase');
    document.head.appendChild(supabaseScript);
})(); 