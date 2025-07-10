// Aguarda o conteúdo do HTML ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADES GERAIS (rodam em todas as páginas) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

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

// --- FUNÇÕES DE CÁLCULO COMPARTILHADAS (disponíveis globalmente) ---

// Função para formatar números como moeda brasileira (BRL)
const formatCurrency = (value) => {
    if (isNaN(value)) return "R$ 0,00";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


// Tabelas de cálculo (valores baseados em 2024/2025)
const inssTable = [
    { limit: 1412.00, rate: 0.075, deduction: 0 },
    { limit: 2666.68, rate: 0.09, deduction: 21.18 },
    { limit: 4000.03, rate: 0.12, deduction: 101.18 },
    { limit: 7786.02, rate: 0.14, deduction: 181.18 }
];
const inssCeiling = 908.85;

const irrfTable = [
    { limit: 2259.20, rate: 0, deduction: 0 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 }
];
const dependentDeduction = 189.59;
const simplifiedDeduction = 564.80;

// Função para calcular o desconto do INSS
const calculateINSS = (base) => {
    if (base <= 0) return 0;
    if (base > 7786.02) return inssCeiling;
    const tier = inssTable.find(t => base <= t.limit);
    return (base * tier.rate) - tier.deduction;
};

// Função para calcular o desconto do IRRF
const calculateIRRF = (base, numDependents) => {
    if (base <= 0) return 0;
    const inss = calculateINSS(base);
    const dependentsValue = (numDependents || 0) * dependentDeduction;
    
    // Opção 1: Deduções Padrão
    const calculationBase = base - inss - dependentsValue;
    const standardTier = irrfTable.find(t => calculationBase <= t.limit);
    const standardIrrf = standardTier ? (calculationBase * standardTier.rate) - standardTier.deduction : 0;

    // Opção 2: Desconto Simplificado
    const simplifiedBase = base - simplifiedDeduction;
    const simplifiedTier = irrfTable.find(t => simplifiedBase <= t.limit);
    const simplifiedIrrf = simplifiedTier ? (simplifiedBase * simplifiedTier.rate) - simplifiedTier.deduction : 0;
    
    // O usuário tem direito ao menor dos dois impostos (o que for mais benéfico)
    return Math.max(0, Math.min(standardIrrf, simplifiedIrrf));
};