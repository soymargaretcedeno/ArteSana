const SUPABASE_URL = 'https://nvixkievosxltiiltgho.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aXhraWV2b3N4bHRpaWx0Z2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjIxMDgsImV4cCI6MjA5Nzg5ODEwOH0.GV_Bv1aEUSxV0q9JeGjUCZfiH21cZI6EK5iraPdlVr8';

function getSupabaseClient() {
    if (typeof supabase === 'undefined') {
        throw new Error('La librería de Supabase no cargó. Usa un servidor local (Live Server) en lugar de abrir el archivo directamente.');
    }
    if (!window._supabaseClient) {
        window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window._supabaseClient;
}

function isSupabaseReachable() {
    return typeof supabase !== 'undefined' && window.location.protocol !== 'file:';
}

function loginLocal(email, password, twoFactorCode) {
    if (!window.localDB) {
        return { success: false, message: translateAuthError({ message: 'Failed to fetch' }) };
    }

    const result = window.localDB.authenticate(email, password, twoFactorCode);
    if (result.success) {
        return { success: true, user: result.user };
    }

    if (result.requires2FA) {
        return { success: false, requires2FA: true, userId: result.userId };
    }

    return { success: false, message: translateAuthError({ message: 'Invalid login credentials' }) };
}

function findLocalUser(email) {
    if (!window.localDB || !Array.isArray(window.localDB.users)) return null;
    return window.localDB.users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase()) || null;
}

function loginOrCreateLocal(email, password, twoFactorCode) {
    const localResult = loginLocal(email, password, twoFactorCode);
    if (localResult.success || localResult.requires2FA) return localResult;

    if (findLocalUser(email)) {
        return { success: false, message: translateAuthError({ message: 'Invalid login credentials' }) };
    }

    const name = String(email || '').split('@')[0] || 'Usuario';
    return registerLocal(name, email, password);
}

function registerLocal(name, email, password) {
    if (!window.localDB) {
        return { success: false, message: translateAuthError({ message: 'Invalid login credentials' }) };
    }

    const result = window.localDB.register({ name, email, password });
    if (result.success) {
        return { success: true, user: result.user };
    }

    const lang = localStorage.getItem('lang') || 'es';
    const message = result.message === 'Email already registered'
        ? (lang === 'en' ? 'This email is already registered' : 'Este correo ya está registrado')
        : result.message;

    return { success: false, message };
}

function isNetworkAuthError(err) {
    const msg = String(err?.message || err || '').toLowerCase();
    return msg.includes('failed to fetch')
        || msg.includes('network')
        || msg.includes('live server')
        || msg.includes('supabase no carg')
        || msg.includes('fetch');
}

function translateAuthError(error) {
    const lang = localStorage.getItem('lang') || 'es';
    const messages = {
        es: {
            'Invalid login credentials': 'Correo o contraseña incorrectos',
            'User already registered': 'Este correo ya está registrado',
            'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
            'Unable to validate email address: invalid format': 'Formato de correo inválido',
            'Email not confirmed': 'Confirma tu correo antes de iniciar sesión',
            'Signup requires a valid password': 'Ingresa una contraseña válida',
            'Failed to fetch': 'Correo o contraseña incorrectos'
        },
        en: {
            'Invalid login credentials': 'Invalid email or password',
            'User already registered': 'This email is already registered',
            'Password should be at least 6 characters': 'Password must be at least 6 characters',
            'Unable to validate email address: invalid format': 'Invalid email format',
            'Email not confirmed': 'Please confirm your email before signing in',
            'Signup requires a valid password': 'Please enter a valid password',
            'Failed to fetch': 'Invalid email or password'
        }
    };
    const table = messages[lang] || messages.es;
    return table[error.message] || error.message;
}

function buildLocalUser(authUser, profile) {
    return {
        id: authUser.id,
        name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
        email: authUser.email,
        role: profile?.role || 'customer',
        roleSelected: profile?.role_selected === true,
        avatar: profile?.avatar || null,
        joinDate: (authUser.created_at || new Date().toISOString()).split('T')[0],
        orders: profile?.orders || 0,
        favorites: profile?.favorites || 0
    };
}

async function fetchProfile(userId) {
    const { data, error } = await getSupabaseClient()
        .from('profiles')
        .select('full_name, role, role_selected, avatar, orders, favorites')
        .eq('id', userId)
        .maybeSingle();

    if (error) console.warn('[Supabase] Error leyendo perfil:', error.message);
    return data;
}

async function saveProfile(userId, name, email, role) {
    const { error } = await getSupabaseClient().from('profiles').upsert({
        id: userId,
        full_name: name,
        email,
        role: role || 'customer',
        role_selected: false,
        updated_at: new Date().toISOString()
    });

    if (error) {
        console.warn('[Supabase] Error guardando perfil:', error.message);
        return error;
    }
    return null;
}

async function updateUserProfile(userId, { name, email }) {
    try {
        const profile = await fetchProfile(userId);
        const { error } = await getSupabaseClient().from('profiles').upsert({
            id: userId,
            full_name: name,
            email,
            role: profile?.role || 'customer',
            role_selected: profile?.role_selected === true,
            updated_at: new Date().toISOString()
        });

        if (error) {
            console.warn('[Supabase] Error actualizando perfil:', error.message);
            return { success: false, message: error.message };
        }

        const { error: metaError } = await getSupabaseClient().auth.updateUser({
            data: { full_name: name }
        });

        if (metaError) {
            console.warn('[Supabase] Error actualizando metadata:', metaError.message);
        }

        return { success: true };
    } catch (err) {
        console.warn('[Supabase] updateUserProfile:', err.message);
        return { success: false, message: err.message };
    }
}

async function syncSessionUser(session) {
    if (!session?.user || !window.localDB) return;
    const profile = await fetchProfile(session.user.id);
    window.localDB.saveCurrentUser(buildLocalUser(session.user, profile));
}

async function register(name, email, password) {
    if (!isSupabaseReachable()) {
        return registerLocal(name, email, password);
    }

    try {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
                emailRedirectTo: window.location.origin + window.location.pathname.replace(/[^/]+$/, 'index.html')
            }
        });

        if (error) {
            console.warn('[Supabase register]', error.message);
            const localResult = registerLocal(name, email, password);
            if (localResult.success) return localResult;
            return {
                success: false,
                message: localResult.message || translateAuthError(error)
            };
        }

        if (!data.user) {
            const localResult = registerLocal(name, email, password);
            if (localResult.success) return localResult;
            return { success: false, message: 'No se pudo crear el usuario. Intenta de nuevo.' };
        }

        if (data.session) {
            await saveProfile(data.user.id, name, email);
            await syncSessionUser(data.session);
            return { success: true, user: window.localDB.getCurrentUser() };
        }

        const localResult = registerLocal(name, email, password);
        if (localResult.success) {
            return { success: true, user: localResult.user };
        }

        return {
            success: false,
            message: localResult.message || (localStorage.getItem('lang') === 'en'
                ? 'This email is already registered'
                : 'Este correo ya está registrado')
        };
    } catch (err) {
        console.warn('[Supabase register] fallback local:', err.message);
        const localResult = registerLocal(name, email, password);
        if (localResult.success) return localResult;
        return {
            success: false,
            message: localResult.message || translateAuthError({ message: err.message })
        };
    }
}

async function login(email, password, twoFactorCode) {
    if (!isSupabaseReachable()) {
        return loginOrCreateLocal(email, password, twoFactorCode);
    }

    try {
        const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });

        if (error) {
            console.warn('[Supabase login]', error.message);
            if (isNetworkAuthError(error)) {
                return loginOrCreateLocal(email, password, twoFactorCode);
            }
            const localResult = loginLocal(email, password, twoFactorCode);
            if (localResult.success || localResult.requires2FA) return localResult;
            return { success: false, message: translateAuthError(error) };
        }

        await syncSessionUser(data.session);
        return { success: true, user: window.localDB.getCurrentUser() };
    } catch (err) {
        console.warn('[Supabase login] fallback local:', err.message);
        return loginOrCreateLocal(email, password, twoFactorCode);
    }
}

async function logout() {
    try {
        if (isSupabaseReachable()) {
            await getSupabaseClient().auth.signOut();
        }
    } catch (err) {
        console.warn('[Supabase logout]', err.message);
    }
    if (window.localDB) {
        window.localDB.clearCurrentUser();
    }
    return { success: true };
}

async function resetPassword(email) {
    if (!isSupabaseReachable()) {
        const lang = localStorage.getItem('lang') || 'es';
        return {
            success: true,
            message: lang === 'en'
                ? 'If this email is registered, you can sign in locally while the cloud service is unavailable.'
                : 'Si este correo está registrado, puedes entrar con tu cuenta local mientras el servicio en la nube no esté disponible.'
        };
    }

    try {
        const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${window.location.pathname.replace(/[^/]+$/, '')}index.html`
        });

        if (error) {
            if (isNetworkAuthError(error)) {
                const lang = localStorage.getItem('lang') || 'es';
                return {
                    success: true,
                    message: lang === 'en'
                        ? 'If this email is registered, you can sign in with your password.'
                        : 'Si este correo está registrado, puedes entrar con tu contraseña.'
                };
            }
            return { success: false, message: translateAuthError(error) };
        }

        return { success: true };
    } catch (err) {
        const lang = localStorage.getItem('lang') || 'es';
        return {
            success: true,
            message: lang === 'en'
                ? 'If this email is registered, you can sign in with your password.'
                : 'Si este correo está registrado, puedes entrar con tu contraseña.'
        };
    }
}

async function initSession() {
    if (!isSupabaseReachable()) return;

    try {
        const { data: { session } } = await getSupabaseClient().auth.getSession();
        if (session) {
            await syncSessionUser(session);
        }

        getSupabaseClient().auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await syncSessionUser(session);
                if (window.renderHeader) window.renderHeader();
            }
            if (event === 'SIGNED_OUT' && window.localDB) {
                window.localDB.clearCurrentUser();
                if (window.renderHeader) window.renderHeader();
            }
        });
    } catch (err) {
        console.error('[Supabase initSession]', err);
    }
}

window.supabaseAuth = {
    get client() { return getSupabaseClient(); },
    register,
    login,
    loginLocal,
    registerLocal,
    logout,
    resetPassword,
    initSession,
    updateUserProfile
};

function startInit() {
    if (window.localDB) {
        initSession();
    } else {
        window.addEventListener('load', initSession);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
} else {
    startInit();
}
