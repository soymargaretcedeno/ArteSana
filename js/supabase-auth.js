const SUPABASE_URL = 'https://jljfzsoflipjcrmlxwka.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lGOTzYU71_qe_fJjp6HO2A_PH55QtXa';

function getSupabaseClient() {
    if (typeof supabase === 'undefined') {
        throw new Error('La librería de Supabase no cargó. Usa un servidor local (Live Server) en lugar de abrir el archivo directamente.');
    }
    if (!window._supabaseClient) {
        window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window._supabaseClient;
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
            'Failed to fetch': 'No se pudo conectar con Supabase. Abre el sitio con Live Server (http://localhost), no como archivo local.'
        },
        en: {
            'Invalid login credentials': 'Invalid email or password',
            'User already registered': 'This email is already registered',
            'Password should be at least 6 characters': 'Password must be at least 6 characters',
            'Unable to validate email address: invalid format': 'Invalid email format',
            'Email not confirmed': 'Please confirm your email before signing in',
            'Signup requires a valid password': 'Please enter a valid password',
            'Failed to fetch': 'Could not connect to Supabase. Open the site with Live Server (http://localhost), not as a local file.'
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
        avatar: profile?.avatar || null,
        joinDate: (authUser.created_at || new Date().toISOString()).split('T')[0],
        orders: profile?.orders || 0,
        favorites: profile?.favorites || 0
    };
}

async function fetchProfile(userId) {
    const { data, error } = await getSupabaseClient()
        .from('profiles')
        .select('full_name, role, avatar, orders, favorites')
        .eq('id', userId)
        .maybeSingle();

    if (error) console.warn('[Supabase] Error leyendo perfil:', error.message);
    return data;
}

async function saveProfile(userId, name, email) {
    const { error } = await getSupabaseClient().from('profiles').upsert({
        id: userId,
        full_name: name,
        email,
        role: 'customer',
        updated_at: new Date().toISOString()
    });

    if (error) {
        console.warn('[Supabase] Error guardando perfil:', error.message);
        return error;
    }
    return null;
}

async function syncSessionUser(session) {
    if (!session?.user || !window.localDB) return;
    const profile = await fetchProfile(session.user.id);
    window.localDB.saveCurrentUser(buildLocalUser(session.user, profile));
}

async function register(name, email, password) {
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
            console.error('[Supabase register]', error);
            return { success: false, message: translateAuthError(error) };
        }

        if (!data.user) {
            return { success: false, message: 'No se pudo crear el usuario. Intenta de nuevo.' };
        }

        console.log('[Supabase] Usuario creado en auth:', data.user.id, data.user.email);

        if (data.session) {
            await saveProfile(data.user.id, name, email);
            await syncSessionUser(data.session);
            return { success: true, user: window.localDB.getCurrentUser() };
        }

        return {
            success: true,
            needsConfirmation: true,
            message: localStorage.getItem('lang') === 'en'
                ? 'Account created in Supabase! Check your email to confirm before signing in.'
                : '¡Cuenta creada en Supabase! Revisa tu correo para confirmar antes de iniciar sesión.'
        };
    } catch (err) {
        console.error('[Supabase register]', err);
        return { success: false, message: err.message || 'Error de conexión con Supabase' };
    }
}

async function login(email, password) {
    try {
        const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });

        if (error) {
            console.error('[Supabase login]', error);
            return { success: false, message: translateAuthError(error) };
        }

        await syncSessionUser(data.session);
        return { success: true, user: window.localDB.getCurrentUser() };
    } catch (err) {
        console.error('[Supabase login]', err);
        return { success: false, message: err.message || 'Error de conexión con Supabase' };
    }
}

async function logout() {
    await getSupabaseClient().auth.signOut();
    if (window.localDB) {
        window.localDB.clearCurrentUser();
    }
    return { success: true };
}

async function resetPassword(email) {
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${window.location.pathname.replace(/[^/]+$/, '')}index.html`
    });

    if (error) {
        return { success: false, message: translateAuthError(error) };
    }

    return { success: true };
}

async function initSession() {
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
    logout,
    resetPassword,
    initSession
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
