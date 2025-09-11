// Funcionalidades Administrativas para o Dashboard

// Função para mostrar seção administrativa
function showAdminFeatures() {
    console.log('👑 INICIANDO CRIAÇÃO DO PAINEL ADMINISTRATIVO');
    
    // Adicionar seção administrativa ao dashboard
    const mainContent = document.querySelector('.main-content');
    
    if (!mainContent) {
        console.error('❌ Elemento .main-content não encontrado no DOM');
        return;
    }
    
    console.log('✅ Elemento .main-content encontrado');
    
    const adminSection = document.createElement('div');
    adminSection.className = 'admin-section';
    adminSection.innerHTML = `
        <div class="admin-header-section">
            <h2><i class="fas fa-user-shield"></i> Painel Administrativo</h2>
            <p>Você está logado como administrador</p>
        </div>
        
        <div class="admin-stats-grid">
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="admin-stat-info">
                    <h3 id="adminTotalUsers">1,247</h3>
                    <p>Total de Usuários</p>
                </div>
            </div>
            
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="admin-stat-info">
                    <h3 id="adminTotalRevenue">R$ 45,890</h3>
                    <p>Receita Total</p>
                </div>
            </div>
            
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-credit-card"></i>
                </div>
                <div class="admin-stat-info">
                    <h3 id="adminPayments">892</h3>
                    <p>Pagamentos Aprovados</p>
                </div>
            </div>
            
            <div class="admin-stat-card">
                <div class="admin-stat-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="admin-stat-info">
                    <h3 id="adminGrowth">+23%</h3>
                    <p>Crescimento Mensal</p>
                </div>
            </div>
        </div>
        
        <div class="admin-actions-grid">
            <button class="admin-action-btn" onclick="viewAllUsers()">
                <i class="fas fa-users"></i>
                <span>Gerenciar Usuários</span>
            </button>
            
            <button class="admin-action-btn" onclick="viewSalesReport()">
                <i class="fas fa-chart-bar"></i>
                <span>Relatórios de Vendas</span>
            </button>
            
            <button class="admin-action-btn" onclick="viewPayments()">
                <i class="fas fa-credit-card"></i>
                <span>Pagamentos</span>
            </button>
            
                    <button class="admin-action-btn" onclick="systemSettings()">
                        <i class="fas fa-cog"></i>
                        <span>Configurações</span>
                    </button>
                    
                    <button class="admin-action-btn" onclick="openAdminPanel()">
                        <i class="fas fa-chart-bar"></i>
                        <span>Painel Completo</span>
                    </button>
        </div>
    `;
    
    // Inserir no início do conteúdo principal
    console.log('📝 Inserindo seção administrativa no DOM...');
    mainContent.insertBefore(adminSection, mainContent.firstChild);
    console.log('✅ Seção administrativa inserida com sucesso');
    
    // Carregar dados administrativos
    console.log('📊 Carregando dados administrativos...');
    loadAdminData();
}

// Função para carregar dados administrativos
function loadAdminData() {
    console.log('📊 INICIANDO CARREGAMENTO DE DADOS ADMINISTRATIVOS');
    
    // Simular carregamento de dados administrativos
    setTimeout(() => {
        console.log('⏰ Timeout executado - Atualizando dados admin...');
        
        // Dados simulados para admin
        const adminTotalUsers = document.getElementById('adminTotalUsers');
        const adminTotalRevenue = document.getElementById('adminTotalRevenue');
        const adminPayments = document.getElementById('adminPayments');
        const adminGrowth = document.getElementById('adminGrowth');
        
        console.log('🔍 Elementos encontrados:', {
            adminTotalUsers: !!adminTotalUsers,
            adminTotalRevenue: !!adminTotalRevenue,
            adminPayments: !!adminPayments,
            adminGrowth: !!adminGrowth
        });
        
        if (adminTotalUsers) {
            adminTotalUsers.textContent = '1,247';
            console.log('✅ adminTotalUsers atualizado');
        }
        if (adminTotalRevenue) {
            adminTotalRevenue.textContent = 'R$ 45,890';
            console.log('✅ adminTotalRevenue atualizado');
        }
        if (adminPayments) {
            adminPayments.textContent = '892';
            console.log('✅ adminPayments atualizado');
        }
        if (adminGrowth) {
            adminGrowth.textContent = '+23%';
            console.log('✅ adminGrowth atualizado');
        }
        
        console.log('🎉 DADOS ADMINISTRATIVOS CARREGADOS COM SUCESSO');
    }, 500);
}

// Funções administrativas
function viewAllUsers() {
    console.log('👥 ADMIN: Visualizando todos os usuários');
    alert('Funcionalidade: Visualizar todos os usuários\n\nEm desenvolvimento - será implementada com dados reais do Supabase');
}

function viewSalesReport() {
    console.log('📊 ADMIN: Visualizando relatórios de vendas');
    alert('Funcionalidade: Relatórios de vendas\n\nEm desenvolvimento - será integrada com Pagar.me API');
}

function viewPayments() {
    console.log('💳 ADMIN: Visualizando pagamentos');
    alert('Funcionalidade: Visualizar pagamentos\n\nEm desenvolvimento - será integrada com Pagar.me API');
}

        function systemSettings() {
            console.log('⚙️ ADMIN: Acessando configurações do sistema');
            alert('Funcionalidade: Configurações do sistema\n\nEm desenvolvimento - painel de configurações avançadas');
        }
        
        function openAdminPanel() {
            console.log('👑 ADMIN: Abrindo painel administrativo');
            window.open('admin-panel.html', '_blank');
        }

// CSS para funcionalidades administrativas
const adminStyles = `
    /* Seção Administrativa */
    .admin-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .admin-header-section h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .admin-header-section p {
        margin: 0;
        opacity: 0.9;
        font-size: 1rem;
    }
    
    .admin-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .admin-stat-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 1rem;
        backdrop-filter: blur(10px);
    }
    
    .admin-stat-icon {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    
    .admin-stat-info h3 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 700;
    }
    
    .admin-stat-info p {
        margin: 0;
        opacity: 0.8;
        font-size: 0.9rem;
    }
    
    .admin-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .admin-action-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        padding: 1rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
    }
    
    .admin-action-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
    }
    
    .admin-action-btn i {
        font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
        .admin-stats-grid {
            grid-template-columns: 1fr;
        }
        
        .admin-actions-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Injetar estilos CSS
function injectAdminStyles() {
    console.log('🎨 INJETANDO ESTILOS ADMINISTRATIVOS');
    const style = document.createElement('style');
    style.textContent = adminStyles;
    document.head.appendChild(style);
    console.log('✅ Estilos administrativos injetados com sucesso');
}

// Inicializar estilos quando o script carregar
console.log('🔧 INICIALIZANDO ADMIN FEATURES');
console.log('📄 Estado do documento:', document.readyState);

if (document.readyState === 'loading') {
    console.log('⏳ Documento ainda carregando - Aguardando DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOMContentLoaded - Injetando estilos');
        injectAdminStyles();
    });
} else {
    console.log('✅ Documento já carregado - Injetando estilos imediatamente');
    injectAdminStyles();
}
