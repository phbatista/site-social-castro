document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate-net-salary');
    if (calculateButton) {
        calculateButton.addEventListener('click', () => {
            // 1. Pega os valores dos campos de input
            const grossSalary = parseFloat(document.getElementById('gross-salary-net').value) || 0;
            const dependents = parseInt(document.getElementById('dependents-net').value) || 0;
            const otherDiscounts = parseFloat(document.getElementById('other-discounts-net').value) || 0;

            // 2. Calcula os descontos usando as funções globais do common.js
            const inss = calculateINSS(grossSalary);
            const irrf = calculateIRRF(grossSalary, dependents);
            
            // 3. Calcula o salário líquido final
            const netSalary = grossSalary - inss - irrf - otherDiscounts;

            // 4. Exibe o resultado na tela
            const resultDiv = document.getElementById('net-salary-result');
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-2">Resultado do Salário Líquido</h4>
                <p><strong>Salário Bruto:</strong> ${formatCurrency(grossSalary)}</p>
                <p class="text-red-700"><strong>Desconto INSS:</strong> ${formatCurrency(inss)}</p>
                <p class="text-red-700"><strong>Desconto IRRF:</strong> ${formatCurrency(irrf)}</p>
                <p class="text-red-700"><strong>Outros Descontos:</strong> ${formatCurrency(otherDiscounts)}</p>
                <p class="font-bold mt-2"><strong>Salário Líquido a Receber:</strong> ${formatCurrency(netSalary)}</p>
            `;
            resultDiv.classList.remove('hidden');
        });
    }
});