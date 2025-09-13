// JavaScript para interatividade do site
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll para links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .benefit-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Efeito parallax suave no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroIllustration = document.querySelector('.hero-illustration');
        if (heroIllustration) {
            heroIllustration.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Botões de CTA - remover redirecionamento automático
    // Agora os botões usam onclick="openPaymentModal()" diretamente no HTML

    // Contador de mães satisfeitas (simulado)
    function updateCounter() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Inicializar contador quando visível
    const counterSection = document.querySelector('.testimonials');
    if (counterSection) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        counterObserver.observe(counterSection);
    }

    // Menu mobile (removido - usando apenas o botão do HTML)

    // Menu mobile para navbar (apenas na página principal)
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuToggle && navMenu) {
            console.log('📱 Inicializando menu mobile...');
            console.log('🔍 Elementos encontrados:');
            console.log('  - mobileMenuToggle:', mobileMenuToggle);
            console.log('  - navMenu:', navMenu);
            
            // Garantir que o menu esteja fechado inicialmente
            navMenu.classList.remove('mobile-open');
            console.log('📱 Menu fechado inicialmente');
            
            // Função para toggle do menu
            function toggleMobileMenu() {
                const isOpen = navMenu.classList.contains('mobile-open');
                console.log('🔄 Toggle menu mobile - Estado atual:', isOpen ? 'ABERTO' : 'FECHADO');
                
                navMenu.classList.toggle('mobile-open');
                
                const newState = navMenu.classList.contains('mobile-open');
                console.log('📱 Menu após toggle:', newState ? 'ABERTO' : 'FECHADO');
                console.log('🎨 Classes do menu:', navMenu.className);
                
                // Verificar estilos computados
                if (newState) {
                    const computedStyle = window.getComputedStyle(navMenu);
                    console.log('🎨 Estilos computados do menu:');
                    console.log('  - display:', computedStyle.display);
                    console.log('  - visibility:', computedStyle.visibility);
                    console.log('  - opacity:', computedStyle.opacity);
                    console.log('  - position:', computedStyle.position);
                    console.log('  - z-index:', computedStyle.zIndex);
                    console.log('  - width:', computedStyle.width);
                    console.log('  - height:', computedStyle.height);
                }
            }
            
            // Remover todos os event listeners existentes
            const newToggle = mobileMenuToggle.cloneNode(true);
            mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
            console.log('🔄 Botão clonado e substituído');
            
            // Adicionar event listener no botão
            newToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Click no botão mobile detectado');
                console.log('🎯 Evento:', e);
                toggleMobileMenu();
            });
            
            // Fechar menu ao clicar fora (com delay maior)
            let clickTimeout;
            document.addEventListener('click', function(e) {
                console.log('🌍 Click detectado no documento:', e.target);
                clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    if (!navMenu.contains(e.target) && !newToggle.contains(e.target)) {
                        console.log('🌍 Click fora do menu - fechando');
                        console.log('🌍 Target do click:', e.target);
                        console.log('🌍 Menu contém target?', navMenu.contains(e.target));
                        console.log('🌍 Botão contém target?', newToggle.contains(e.target));
                        navMenu.classList.remove('mobile-open');
                        console.log('🌍 Menu fechado por click fora');
                    } else {
                        console.log('🌍 Click dentro do menu - mantendo aberto');
                    }
                }, 200);
            });
            
            // Fechar menu ao redimensionar para desktop
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    console.log('🖥️ Redimensionado para desktop - fechando menu');
                    navMenu.classList.remove('mobile-open');
                }
            });
            
            // Fechar menu ao clicar em um link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    console.log('🔗 Click em link - fechando menu');
                    navMenu.classList.remove('mobile-open');
                });
            });
            
            // Observer para detectar mudanças no menu
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        console.log('🔍 Mudança detectada no menu:');
                        console.log('  - Classes antigas:', mutation.oldValue);
                        console.log('  - Classes novas:', navMenu.className);
                        console.log('  - Menu aberto?', navMenu.classList.contains('mobile-open'));
                    }
                });
            });
            
            observer.observe(navMenu, {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: ['class']
            });
            
            console.log('✅ Menu mobile inicializado com sucesso');
        } else {
            console.log('❌ Elementos do menu mobile não encontrados');
            console.log('🔍 mobileMenuToggle:', mobileMenuToggle);
            console.log('🔍 navMenu:', navMenu);
        }
    }
    
    // Inicializar menu mobile apenas na página principal
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initMobileMenu();
    }
    
    // Menu mobile inicializado via HTML

    // Adicionar efeito de hover nos cards
    const cards = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Simular carregamento de conteúdo
    function simulateContentLoading() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transition = 'opacity 0.5s ease';
            }, Math.random() * 1000);
        });
    }

    // Inicializar simulação de carregamento
    simulateContentLoading();

    // Adicionar feedback visual para interações
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .nav-link, .feature-card, .testimonial-card')) {
            // Criar efeito de ripple
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            e.target.style.position = 'relative';
            e.target.style.overflow = 'hidden';
            e.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });

    // Adicionar CSS para animação ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .mobile-menu-btn {
            display: none;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block !important;
            }
            
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
            }
        }
    `;
    document.head.appendChild(style);

    // Destacar link ativo baseado na URL atual
    function highlightActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === '#home')) {
                link.classList.add('active');
            }
        });
    }
    
    // Aplicar destaque ao link ativo
    highlightActiveLink();
    
    console.log('🎉 Meu Bebê Inteligente - Site carregado com sucesso!');
});
