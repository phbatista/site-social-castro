document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate-vacation');
    const clearButton = document.getElementById('clear-vacation');
    const resultDiv = document.getElementById('vacation-result');

    // Inputs
    const grossSalaryInput = document.getElementById('gross-salary-vacation');
    const extraHoursInput = document.getElementById('extra-hours');
    const dependentsInput = document.getElementById('dependents-vacation');
    const vacationDaysInput = document.getElementById('vacation-days');
    const sellVacationSelect = document.getElementById('sell-vacation');
    const advance13thSelect = document.getElementById('advance-13th');

    // Formatação de moeda para os inputs
    const formatInputAsCurrency = (input) => {
        if (!input) return;
        input.addEventListener('keyup', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value === '') {
                e.target.value = '';
                return;
            }
            value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            e.target.value = value;
        });
    };
    formatInputAsCurrency(grossSalaryInput);
    formatInputAsCurrency(extraHoursInput);

    // Função para limpar o formulário
    const clearForm = () => {
        grossSalaryInput.value = '';
        extraHoursInput.value = '';
        dependentsInput.value = '0';
        vacationDaysInput.value = '30';
        sellVacationSelect.value = 'nao';
        advance13thSelect.value = 'nao';
        resultDiv.classList.add('hidden');
        resultDiv.innerHTML = '';
    };

    if (clearButton) {
        clearButton.addEventListener('click', clearForm);
    }

    if (calculateButton) {
        calculateButton.addEventListener('click', () => {
            // 1. Coleta e converte os valores dos inputs
            const parseCurrency = (value) => parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
            const grossSalary = parseCurrency(grossSalaryInput.value);
            const extraHours = parseCurrency(extraHoursInput.value);
            const dependents = parseInt(dependentsInput.value) || 0;
            const vacationDays = parseInt(vacationDaysInput.value) || 30;
            const sellVacation = sellVacationSelect.value === 'sim';
            const advance13th = advance13thSelect.value === 'sim';

            // 2. Cálculos precisos conforme a CLT
            const calculationBase = grossSalary + extraHours;
            
            // Valor dos dias de férias que serão gozados
            const vacationValue = (calculationBase / 30) * vacationDays;
            
            // O terço constitucional é sempre sobre o salário base completo
            const vacationBonus = calculationBase / 3;
            
            // Total bruto das férias (base para cálculo de impostos)
            const grossVacation = vacationValue + vacationBonus;

            // Abono Pecuniário (venda de 1/3 das férias) é isento de impostos
            let cashBonus = 0;
            if (sellVacation) {
                // O valor do abono é 1/3 do salário base.
                cashBonus = calculationBase / 3;
            }

            // Adiantamento do 13º (também não incide impostos no adiantamento)
            let advance13thValue = 0;
            if (advance13th) {
                const currentMonth = new Date().getMonth() + 1;
                advance13thValue = (calculationBase / 12 * currentMonth) / 2;
            }

            // Descontos são calculados sobre o total bruto das férias
            const inss = calculateINSS(grossVacation);
            const irrf = calculateIRRF(grossVacation, dependents);
            const totalDiscounts = inss + irrf;

            // Valor líquido
            const netVacation = grossVacation - totalDiscounts;
            const totalToReceive = netVacation + cashBonus + advance13thValue;

            // 3. Exibição do resultado passo a passo
            resultDiv.innerHTML = `
                <h3 class="text-xl font-bold text-center mb-4 text-gray-800">Demonstrativo do Cálculo de Férias</h3>
                <div class="space-y-3 text-gray-700">
                    <div class="p-4 bg-white rounded-lg shadow-sm">
                        <p class="font-semibold">1. Base de Cálculo (Salário Bruto + Média de H.E.)</p>
                        <p class="text-lg font-bold text-red-600">${formatCurrency(calculationBase)}</p>
                    </div>
                    <div class="p-4 bg-white rounded-lg shadow-sm">
                        <p class="font-semibold">2. Férias Brutas</p>
                        <p>Valor dos ${vacationDays} dias de férias: ${formatCurrency(vacationValue)}</p>
                        <p>Terço Constitucional (1/3): ${formatCurrency(vacationBonus)}</p>
                        <p class="font-bold">Total Bruto (Base para Impostos): <span class="text-lg font-bold text-red-600">${formatCurrency(grossVacation)}</span></p>
                    </div>
                    <div class="p-4 bg-white rounded-lg shadow-sm">
                        <p class="font-semibold">3. Deduções sobre Férias Brutas</p>
                        <p>INSS sobre Férias: ${formatCurrency(inss)}</p>
                        <p>IRRF sobre Férias: ${formatCurrency(irrf)}</p>
                        <p class="font-bold">Total de Descontos: <span class="text-lg font-bold text-red-600">${formatCurrency(totalDiscounts)}</span></p>
                    </div>
                     ${(sellVacation || advance13th) ? `
                        <div class="p-4 bg-white rounded-lg shadow-sm">
                            <p class="font-semibold">4. Outros Vencimentos (Isentos de Imposto)</p>
                            ${sellVacation ? `<p>Abono Pecuniário (Venda 1/3): ${formatCurrency(cashBonus)}</p>` : ''}
                            ${advance13th ? `<p>Adiantamento 13º Salário: ${formatCurrency(advance13thValue)}</p>` : ''}
                        </div>
                    ` : ''}
                    <div class="p-6 bg-red-50 rounded-lg text-center">
                        <p class="font-semibold text-gray-800">VALOR LÍQUIDO A RECEBER</p>
                        <p class="text-3xl font-bold text-red-700">${formatCurrency(totalToReceive)}</p>
                        <p class="text-xs mt-2 text-gray-500">(${formatCurrency(grossVacation)} - ${formatCurrency(totalDiscounts)} + ${formatCurrency(cashBonus + advance13thValue)})</p>
                    </div>
                </div>
                <p class="text-xs text-center mt-4 text-gray-500">Este resultado é uma estimativa e não substitui o holerite oficial. O cálculo do abono pecuniário (venda de 1/3) é isento de INSS e IRRF.</p>
            `;
            resultDiv.classList.remove('hidden');
        });
    }
});