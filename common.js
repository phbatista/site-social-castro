// Aguarda o conteúdo do HTML ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- CARREGADOR DE COMPONENTES (HEADER E FOOTER) ---
    const loadComponent = (selector, url) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url)
                .then(response => response.ok ? response.text() : Promise.reject('Componente não encontrado.'))
                .then(data => {
                    element.innerHTML = data;
                    // Re-executa a lógica do menu mobile APÓS o header ser carregado
                    initializeMobileMenu(); 
                    // Re-executa a lógica do ano do rodapé APÓS o footer ser carregado
                    initializeFooterYear();
                })
                .catch(error => console.error(`Erro ao carregar ${selector}:`, error));
        }
    };
    
    // Carrega os componentes. A barra "/" no início garante que o caminho é absoluto a partir da raiz do site.
    loadComponent('div#header-placeholder', '/_header.html');
    loadComponent('div#footer-placeholder', '/_footer.html');


    // --- FUNÇÃO PARA INICIALIZAR O MENU MOBILE ---
    const initializeMobileMenu = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    };

    // --- FUNÇÃO PARA ATUALIZAR O ANO NO RODAPÉ ---
    const initializeFooterYear = () => {
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };


    // --- FUNCIONALIDADES DA PÁGINA PRINCIPAL ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');
                answer.classList.toggle('open');
                icon.classList.toggle('rotate-180');
            });
        });
    }
});