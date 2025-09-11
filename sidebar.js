// Sidebar Global Script
console.log('🚀 Sidebar script carregado!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - iniciando sidebar...');
    
    // Função para criar a sidebar global
    function createGlobalSidebar() {
        console.log('🏗️ Criando sidebar global...');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('📄 Página atual detectada:', currentPage);
        
        const sidebarHTML = `
            <div class="global-sidebar" id="globalSidebar">
                <div class="global-sidebar-header">
                    <h2><i class="fas fa-heart"></i> Meu Bebê Inteligente</h2>
                    <p>Área do Membro</p>
                </div>
                <ul class="global-sidebar-menu">
                    <li><a href="dashboard.html" ${currentPage === 'dashboard.html' ? 'class="active"' : ''}><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a href="musicas.html" ${currentPage === 'musicas.html' ? 'class="active"' : ''}><i class="fas fa-music"></i> Músicas</a></li>
                    <li><a href="videos.html" ${currentPage === 'videos.html' ? 'class="active"' : ''}><i class="fas fa-play"></i> Vídeos</a></li>
                    <li><a href="ingles.html" ${currentPage === 'ingles.html' ? 'class="active"' : ''}><i class="fas fa-globe"></i> Inglês</a></li>
                    <li><a href="videos.html?filter=devocional" ${currentPage === 'videos.html' ? 'class="active"' : ''}><i class="fas fa-pray"></i> Devocional Kids</a></li>
                    <li><a href="desenhos.html" ${currentPage === 'desenhos.html' ? 'class="active"' : ''}><i class="fas fa-palette"></i> Desenhos</a></li>
                    <li><a href="brincadeiras.html" ${currentPage === 'brincadeiras.html' ? 'class="active"' : ''}><i class="fas fa-gamepad"></i> Brincadeiras</a></li>
                    <li><a href="brinquedos.html" ${currentPage === 'brinquedos.html' ? 'class="active"' : ''}><i class="fas fa-tools"></i> Brinquedos</a></li>
                    <li><a href="jogos.html" ${currentPage === 'jogos.html' ? 'class="active"' : ''}><i class="fas fa-puzzle-piece"></i> Jogos</a></li>
                                <li><a href="censura.html" ${currentPage === 'censura.html' ? 'class="active"' : ''}><i class="fas fa-shield-alt"></i> Censura</a></li>
                                <li><a href="#" onclick="secureLogout()"><i class="fas fa-sign-out-alt"></i> Sair</a></li>
                                <li><a href="assinantes.html"><i class="fas fa-home"></i> Voltar ao Site</a></li>
                </ul>
            </div>
            
            <button class="sidebar-mobile-btn" id="sidebarMobileBtn">
                <i class="fas fa-bars"></i>
            </button>
            
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
        `;
        
        console.log('📝 HTML da sidebar criado, inserindo no DOM...');
        
        // Inserir no início do body
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        console.log('✅ Sidebar HTML inserido no DOM');
        
        // Verificar se os elementos foram criados
        const globalSidebar = document.getElementById('globalSidebar');
        const sidebarMobileBtn = document.getElementById('sidebarMobileBtn');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        console.log('🔍 Verificando elementos criados:');
        console.log('  - globalSidebar:', globalSidebar);
        console.log('  - sidebarMobileBtn:', sidebarMobileBtn);
        console.log('  - sidebarOverlay:', sidebarOverlay);
        
        // Envolver o conteúdo existente (exceto a sidebar) em content-with-sidebar
        const existingContent = document.body.innerHTML;
        const sidebarElements = document.getElementById('globalSidebar').outerHTML + 
                               document.getElementById('sidebarMobileBtn').outerHTML + 
                               document.getElementById('sidebarOverlay').outerHTML;
        
        const contentWithoutSidebar = existingContent.replace(sidebarElements, '');
        
        document.body.innerHTML = sidebarElements + '<div class="content-with-sidebar">' + contentWithoutSidebar + '</div>';
        console.log('✅ Conteúdo reorganizado com sidebar');
    }
    
    // Função para inicializar a funcionalidade mobile
    function initSidebarMobile() {
        console.log('🔧 Iniciando função initSidebarMobile...');
        
        // Aguardar um pouco para garantir que o DOM esteja pronto
        setTimeout(() => {
            console.log('⏰ Timeout executado, procurando elementos...');
            
            const sidebarMobileBtn = document.getElementById('sidebarMobileBtn');
            const globalSidebar = document.getElementById('globalSidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            
            console.log('🔧 Inicializando sidebar mobile...');
            console.log('📱 Botão mobile encontrado:', !!sidebarMobileBtn);
            console.log('📱 Botão mobile elemento:', sidebarMobileBtn);
            console.log('📋 Sidebar encontrada:', !!globalSidebar);
            console.log('📋 Sidebar elemento:', globalSidebar);
            console.log('🌫️ Overlay encontrado:', !!sidebarOverlay);
            console.log('🌫️ Overlay elemento:', sidebarOverlay);
            
            // Verificar se o botão está visível
            if (sidebarMobileBtn) {
                const computedStyle = window.getComputedStyle(sidebarMobileBtn);
                console.log('📱 Estilo do botão mobile:');
                console.log('  - display:', computedStyle.display);
                console.log('  - visibility:', computedStyle.visibility);
                console.log('  - opacity:', computedStyle.opacity);
                console.log('  - position:', computedStyle.position);
                console.log('  - z-index:', computedStyle.zIndex);
                console.log('  - top:', computedStyle.top);
                console.log('  - left:', computedStyle.left);
                console.log('  - width:', computedStyle.width);
                console.log('  - height:', computedStyle.height);
                console.log('  - offsetParent:', sidebarMobileBtn.offsetParent);
                console.log('  - offsetWidth:', sidebarMobileBtn.offsetWidth);
                console.log('  - offsetHeight:', sidebarMobileBtn.offsetHeight);
                
                // Verificar se está em mobile
                const isMobile = window.innerWidth <= 768;
                console.log('📱 É mobile?', isMobile);
                console.log('📱 Largura da tela:', window.innerWidth);
            }
            
            if (sidebarMobileBtn && globalSidebar && sidebarOverlay) {
                console.log('✅ Todos os elementos encontrados!');
                
                // Remover event listeners existentes para evitar duplicação
                try {
                    sidebarMobileBtn.removeEventListener('click', handleMobileToggle);
                    sidebarOverlay.removeEventListener('click', handleOverlayClick);
                    console.log('🧹 Event listeners antigos removidos');
                } catch (e) {
                    console.log('⚠️ Erro ao remover listeners antigos:', e);
                }
                
                // Adicionar novos event listeners
                try {
                    sidebarMobileBtn.addEventListener('click', handleMobileToggle);
                    sidebarOverlay.addEventListener('click', handleOverlayClick);
                    console.log('✅ Event listeners adicionados com sucesso');
                    
                    // Teste adicional - adicionar onclick direto como backup
                    sidebarMobileBtn.onclick = function(e) {
                        console.log('🎯 ONCLICK DIRETO ATIVADO!');
                        e.preventDefault();
                        e.stopPropagation();
                        handleMobileToggle();
                    };
                    console.log('🔄 Onclick direto adicionado como backup');
                    
                } catch (e) {
                    console.error('❌ Erro ao adicionar event listeners:', e);
                }
            } else {
                console.error('❌ Elementos do sidebar não encontrados!');
                console.log('🔍 Tentando novamente em 500ms...');
                setTimeout(initSidebarMobile, 500);
            }
        }, 100);
    }
    
    // Funções separadas para os event handlers
    function handleMobileToggle() {
        console.log('🎯 handleMobileToggle chamada!');
        console.log('🎯 Evento recebido:', event);
        
        const globalSidebar = document.getElementById('globalSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        console.log('🔍 Elementos encontrados no toggle:');
        console.log('  - globalSidebar:', globalSidebar);
        console.log('  - sidebarOverlay:', sidebarOverlay);
        
        if (globalSidebar && sidebarOverlay) {
            console.log('🔄 Aplicando toggle...');
            
            // Verificar estado atual
            const isOpen = globalSidebar.classList.contains('open');
            console.log('📊 Estado atual da sidebar (aberta):', isOpen);
            
            globalSidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
            
            // Verificar estado após toggle
            const isOpenAfter = globalSidebar.classList.contains('open');
            console.log('📊 Estado após toggle (aberta):', isOpenAfter);
            
            console.log('✅ Sidebar toggle executado com sucesso');
        } else {
            console.error('❌ Elementos não encontrados no toggle!');
        }
    }
    
    function handleOverlayClick() {
        console.log('🌫️ handleOverlayClick chamada!');
        console.log('🌫️ Evento recebido:', event);
        
        const globalSidebar = document.getElementById('globalSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        console.log('🔍 Elementos encontrados no overlay click:');
        console.log('  - globalSidebar:', globalSidebar);
        console.log('  - sidebarOverlay:', sidebarOverlay);
        
        if (globalSidebar && sidebarOverlay) {
            console.log('🔄 Fechando sidebar...');
            globalSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            console.log('✅ Sidebar fechada com sucesso');
        } else {
            console.error('❌ Elementos não encontrados no overlay click!');
        }
    }
    
    // Aplicar apenas nas páginas de área de membros (não na página de vendas)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('📄 Página atual detectada:', currentPage);
    console.log('🔍 URL completa:', window.location.href);
    console.log('🔍 Pathname:', window.location.pathname);
    
    if (currentPage !== 'index.html') {
        console.log('✅ Página de área de membros detectada - aplicando sidebar');
        console.log('🏗️ Criando sidebar global...');
        createGlobalSidebar();
        console.log('📱 Inicializando funcionalidade mobile...');
        initSidebarMobile();
        
        // Fallback adicional para garantir que a funcionalidade mobile funcione
        setTimeout(() => {
            console.log('🔄 Verificando fallback mobile...');
            const sidebarMobileBtn = document.getElementById('sidebarMobileBtn');
            console.log('📱 Botão encontrado para fallback:', !!sidebarMobileBtn);
            
            if (sidebarMobileBtn && !sidebarMobileBtn.hasAttribute('data-initialized')) {
                console.log('🔄 Aplicando fallback para funcionalidade mobile...');
                sidebarMobileBtn.setAttribute('data-initialized', 'true');
                sidebarMobileBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🎯 FALLBACK MOBILE BUTTON CLICKED!');
                    const globalSidebar = document.getElementById('globalSidebar');
                    const sidebarOverlay = document.getElementById('sidebarOverlay');
                    
                    console.log('🔍 Elementos no fallback:');
                    console.log('  - globalSidebar:', globalSidebar);
                    console.log('  - sidebarOverlay:', sidebarOverlay);
                    
                    if (globalSidebar && sidebarOverlay) {
                        globalSidebar.classList.toggle('open');
                        sidebarOverlay.classList.toggle('active');
                        console.log('✅ Fallback sidebar toggle executado');
                    } else {
                        console.error('❌ Elementos não encontrados no fallback!');
                    }
                };
                console.log('✅ Fallback onclick aplicado');
            } else {
                console.log('⚠️ Fallback não aplicado - botão já inicializado ou não encontrado');
            }
        }, 500);
        
        // Debug: verificar se o Devocional Kids foi criado
        setTimeout(() => {
            const devocionalLink = document.querySelector('a[href*="devocional"]');
            const allLinks = document.querySelectorAll('.global-sidebar-menu a');
            
            console.log('🔍 Verificando links do sidebar:');
            allLinks.forEach((link, index) => {
                console.log(`Link ${index + 1}: "${link.textContent.trim()}" - ${link.href}`);
            });
            
            if (devocionalLink) {
                console.log('✅ Devocional Kids encontrado no sidebar:', devocionalLink.textContent);
            } else {
                console.error('❌ Devocional Kids NÃO encontrado no sidebar!');
            }
        }, 100);
        
        // Log final de verificação
        setTimeout(() => {
            console.log('🔍 VERIFICAÇÃO FINAL:');
            const finalBtn = document.getElementById('sidebarMobileBtn');
            const finalSidebar = document.getElementById('globalSidebar');
            const finalOverlay = document.getElementById('sidebarOverlay');
            
            console.log('📱 Botão final:', finalBtn);
            console.log('📋 Sidebar final:', finalSidebar);
            console.log('🌫️ Overlay final:', finalOverlay);
            
            if (finalBtn) {
                const finalStyle = window.getComputedStyle(finalBtn);
                console.log('📱 Botão está visível:', finalBtn.offsetParent !== null);
                console.log('📱 Botão tem onclick:', !!finalBtn.onclick);
                console.log('📱 Botão tem event listeners:', finalBtn.addEventListener ? 'Sim' : 'Não');
                console.log('📱 Estilo final do botão:');
                console.log('  - display:', finalStyle.display);
                console.log('  - visibility:', finalStyle.visibility);
                console.log('  - opacity:', finalStyle.opacity);
                console.log('  - offsetWidth:', finalBtn.offsetWidth);
                console.log('  - offsetHeight:', finalBtn.offsetHeight);
                console.log('📱 Largura da tela final:', window.innerWidth);
                console.log('📱 É mobile final?', window.innerWidth <= 768);
            }
        }, 1000);
        
                } else {
                    console.log('🏠 Página de vendas detectada - sidebar não aplicado');
                }
            });
            
            // Função de logout
            window.logout = function() {
                if (confirm('Tem certeza que deseja sair?')) {
                    // Limpar dados do localStorage
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userAccount');
                    localStorage.removeItem('userPlan');
                    localStorage.removeItem('userEndDate');
                    localStorage.removeItem('paymentConfirmed');
                    
                    // Redirecionar para página de vendas
                    window.location.href = 'index.html';
                }
            };
