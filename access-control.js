// Sistema de Controle de Acesso - Meu Bebê Inteligente
// Verifica se o usuário tem acesso às páginas de membros

// Configurações
const ACCESS_CONFIG = {
    // Páginas que requerem login
    PROTECTED_PAGES: [
        'dashboard.html',
        'musicas.html',
        'videos.html',
        'desenhos.html',
        'brincadeiras.html',
        'jogos.html',
        'brinquedos.html',
        'censura.html',
        'admin-panel.html'
    ],
    
    // Páginas públicas (não requerem login)
    PUBLIC_PAGES: [
        'index.html',
        'assinantes.html'
    ],
    
    // URL de redirecionamento para não logados
    LOGIN_REDIRECT: 'assinantes.html'
};

// Função principal de verificação de acesso
function checkAccess() {
    console.log('🔐 VERIFICANDO ACESSO À PÁGINA');
    
    // Obter nome da página atual
    const currentPage = getCurrentPageName();
    console.log('📄 Página atual:', currentPage);
    
    // Verificar se é uma página protegida
    if (ACCESS_CONFIG.PROTECTED_PAGES.includes(currentPage)) {
        console.log('🛡️ PÁGINA PROTEGIDA - Verificando login...');
        return verifyUserAccess();
    } else {
        console.log('🌐 PÁGINA PÚBLICA - Acesso liberado');
        return true;
    }
}

// Obter nome da página atual
function getCurrentPageName() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop();
    return pageName || 'index.html';
}

// Verificar se o usuário tem acesso
function verifyUserAccess() {
    console.log('👤 VERIFICANDO USUÁRIO...');
    
    // Verificar se é admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (isAdmin && adminEmail) {
        console.log('👑 USUÁRIO É ADMIN - Acesso total permitido');
        return true;
    }
    
    // Verificar se usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const paymentConfirmed = localStorage.getItem('paymentConfirmed');
    
    console.log('📊 DADOS DO USUÁRIO:', {
        isLoggedIn: isLoggedIn,
        userEmail: userEmail,
        paymentConfirmed: paymentConfirmed
    });
    
    if (!isLoggedIn || !userEmail) {
        console.log('❌ USUÁRIO NÃO LOGADO');
        redirectToLogin();
        return false;
    }
    
    if (!paymentConfirmed) {
        console.log('❌ PAGAMENTO NÃO CONFIRMADO');
        redirectToLogin();
        return false;
    }
    
    // Verificar se o plano ainda está válido
    const userEndDate = localStorage.getItem('userEndDate');
    if (userEndDate) {
        const endDate = new Date(userEndDate);
        const now = new Date();
        
        if (now > endDate) {
            console.log('❌ PLANO EXPIRADO');
            redirectToLogin();
            return false;
        }
    }
    
    console.log('✅ USUÁRIO AUTORIZADO - Acesso permitido');
    return true;
}

// Redirecionar para página de assinantes
function redirectToLogin(message) {
    console.log('🔄 REDIRECIONANDO PARA PÁGINA DE ASSINANTES:', message);
    
    // Redirecionar diretamente para a página de assinantes
    window.location.href = ACCESS_CONFIG.LOGIN_REDIRECT;
}

// Verificar acesso ao carregar a página
function initAccessControl() {
    console.log('🚀 INICIANDO CONTROLE DE ACESSO');
    
    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
        const hasAccess = checkAccess();
        
        if (!hasAccess) {
            console.log('🚫 ACESSO NEGADO - Redirecionando...');
            return;
        }
        
        console.log('✅ ACESSO PERMITIDO - Página carregada com sucesso');
        
        // Se chegou até aqui, o usuário tem acesso
        // Pode executar código específico da página aqui
        onAccessGranted();
    }, 100);
}

// Função chamada quando o acesso é concedido
function onAccessGranted() {
    console.log('🎉 ACESSO CONCEDIDO - Executando código da página');
    
    // Verificar se é admin e mostrar funcionalidades específicas
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        console.log('👑 ADMIN DETECTADO - Carregando funcionalidades administrativas');
        loadAdminFeatures();
    }
}

// Carregar funcionalidades administrativas
function loadAdminFeatures() {
    // Verificar se o arquivo admin-features.js existe
    if (typeof showAdminFeatures === 'function') {
        console.log('🔧 Carregando funcionalidades administrativas...');
        showAdminFeatures();
    } else {
        console.log('⚠️ Arquivo admin-features.js não encontrado');
    }
}

// Função para logout seguro
function secureLogout() {
    console.log('🚪 LOGOUT SEGURO');
    
    // Limpar dados sensíveis
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userEndDate');
    localStorage.removeItem('userPlan');
    localStorage.removeItem('paymentConfirmed');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    
    // Redirecionar para página de assinantes
    window.location.href = 'assinantes.html';
}

// Verificar se a página atual requer proteção
function isPageProtected(pageName = null) {
    const page = pageName || getCurrentPageName();
    return ACCESS_CONFIG.PROTECTED_PAGES.includes(page);
}

// Verificar se o usuário está logado
function isUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const paymentConfirmed = localStorage.getItem('paymentConfirmed') === 'true';
    
    return isLoggedIn && userEmail && paymentConfirmed;
}

// Verificar se é admin
function isUserAdmin() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminEmail = localStorage.getItem('adminEmail');
    
    return isAdmin && adminEmail;
}

// Exportar funções para uso global
if (typeof window !== 'undefined') {
    window.checkAccess = checkAccess;
    window.verifyUserAccess = verifyUserAccess;
    window.initAccessControl = initAccessControl;
    window.secureLogout = secureLogout;
    window.isPageProtected = isPageProtected;
    window.isUserLoggedIn = isUserLoggedIn;
    window.isUserAdmin = isUserAdmin;
}

// Inicializar automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessControl);
} else {
    initAccessControl();
}
