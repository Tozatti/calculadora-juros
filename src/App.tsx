/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  Info, 
  ChevronRight, 
  ArrowRight,
  DollarSign,
  Calendar,
  Percent,
  Table as TableIcon
} from 'lucide-react';
import { EvolutionData, CalculationResults } from './types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function App() {
  const [initialValue, setInitialValue] = useState<number>(1000);
  const [monthlyValue, setMonthlyValue] = useState<number>(100);
  const [interestRate, setInterestRate] = useState<number>(0.8);
  const [interestType, setInterestType] = useState<'monthly' | 'annual'>('monthly');
  const [period, setPeriod] = useState<number>(12);
  const [periodType, setPeriodType] = useState<'months' | 'years'>('months');

  const results = useMemo((): CalculationResults => {
    const totalMonths = periodType === 'years' ? period * 12 : period;
    const monthlyRate = interestType === 'annual' 
      ? Math.pow(1 + interestRate / 100, 1 / 12) - 1 
      : interestRate / 100;

    let currentTotal = initialValue;
    let totalInvested = initialValue;
    let totalInterest = 0;
    const evolution: EvolutionData[] = [{
      month: 0,
      interest: 0,
      totalInvested: initialValue,
      totalInterest: 0,
      totalAccumulated: initialValue
    }];

    for (let i = 1; i <= totalMonths; i++) {
      const interestOfMonth = currentTotal * monthlyRate;
      currentTotal += interestOfMonth + monthlyValue;
      totalInvested += monthlyValue;
      totalInterest += interestOfMonth;

      evolution.push({
        month: i,
        interest: interestOfMonth,
        totalInvested: totalInvested,
        totalInterest: totalInterest,
        totalAccumulated: currentTotal
      });
    }

    return {
      totalFinal: currentTotal,
      totalInvested,
      totalInterest,
      evolution
    };
  }, [initialValue, monthlyValue, interestRate, interestType, period, periodType]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 py-6 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#A31616] p-2 rounded-lg">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#A31616]">Simulador de Juros Compostos</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-800 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Calculator className="w-5 h-5 text-[#A31616]" />
                Parâmetros
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-zinc-500" />
                    Valor Inicial
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
                    <input 
                      type="number" 
                      value={initialValue}
                      onChange={(e) => setInitialValue(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#A31616] focus:border-transparent outline-none transition-all text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zinc-500" />
                    Valor Mensal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
                    <input 
                      type="number" 
                      value={monthlyValue}
                      onChange={(e) => setMonthlyValue(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#A31616] focus:border-transparent outline-none transition-all text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-zinc-500" />
                    Taxa de Juros
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full pr-8 pl-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#A31616] focus:border-transparent outline-none transition-all text-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">%</span>
                    </div>
                    <select 
                      value={interestType}
                      onChange={(e) => setInterestType(e.target.value as 'monthly' | 'annual')}
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#A31616] outline-none text-sm text-white"
                    >
                      <option value="monthly">Mensal</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    Período
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={period}
                      onChange={(e) => setPeriod(Number(e.target.value))}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#A31616] focus:border-transparent outline-none transition-all text-white"
                    />
                    <select 
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value as 'months' | 'years')}
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#A31616] outline-none text-sm text-white"
                    >
                      <option value="months">Meses</option>
                      <option value="years">Anos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step by Step Guide */}
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#A31616]" />
                Como utilizar
              </h3>
              <div className="space-y-4">
                {[
                  { step: 1, text: "Defina o valor que você já tem para começar." },
                  { step: 2, text: "Informe quanto pretende poupar todos os meses." },
                  { step: 3, text: "Escolha a taxa de rentabilidade esperada." },
                  { step: 4, text: "Determine por quanto tempo o dinheiro ficará rendendo." },
                  { step: 5, text: "Veja a mágica dos juros compostos acontecer abaixo!" }
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#A31616]/20 text-[#A31616] rounded-full flex items-center justify-center text-xs font-bold">
                      {item.step}
                    </span>
                    <p className="text-sm text-zinc-400 leading-tight">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#A31616] p-6 rounded-2xl shadow-lg text-white">
                <p className="text-sm opacity-80 mb-1">Valor total final</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalFinal)}</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">Valor total investido</p>
                <p className="text-2xl font-bold text-zinc-100">{formatCurrency(results.totalInvested)}</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">Total em juros</p>
                <p className="text-2xl font-bold text-[#A31616]">{formatCurrency(results.totalInterest)}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#A31616]">Gráfico de Evolução</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-[#A31616] rounded-full"></div>
                    <span className="text-zinc-400">Total Acumulado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-zinc-100 rounded-full"></div>
                    <span className="text-zinc-400">Valor Investido</span>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.evolution} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#666' }}
                      label={{ value: periodType === 'years' ? 'Meses' : 'Período', position: 'insideBottom', offset: -5, fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#666' }}
                      tickFormatter={(value) => `R$ ${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalAccumulated" 
                      stroke="#A31616" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#A31616', strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    >
                      <LabelList 
                        dataKey="totalAccumulated" 
                        position="top" 
                        fontSize={10} 
                        fill="#A31616"
                        formatter={(val: number) => formatCurrency(val)} 
                      />
                    </Line>
                    <Line 
                      type="monotone" 
                      dataKey="totalInvested" 
                      stroke="#f4f4f5" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#f4f4f5', strokeWidth: 2 }}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    >
                      <LabelList 
                        dataKey="totalInvested" 
                        position="bottom" 
                        fontSize={10} 
                        fill="#f4f4f5"
                        formatter={(val: number) => formatCurrency(val)} 
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#A31616] flex items-center gap-2">
                  <TableIcon className="w-5 h-5" />
                  Tabela de Evolução
                </h3>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-800 text-zinc-400 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 font-medium">Mês</th>
                      <th className="px-6 py-4 font-medium">Juros</th>
                      <th className="px-6 py-4 font-medium">Total Investido</th>
                      <th className="px-6 py-4 font-medium">Total Juros</th>
                      <th className="px-6 py-4 font-medium">Total Acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {results.evolution.map((row) => (
                      <tr key={row.month} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{row.month}</td>
                        <td className="px-6 py-4 text-emerald-400">+{formatCurrency(row.interest)}</td>
                        <td className="px-6 py-4 text-zinc-300">{formatCurrency(row.totalInvested)}</td>
                        <td className="px-6 py-4 text-[#A31616]">{formatCurrency(row.totalInterest)}</td>
                        <td className="px-6 py-4 font-bold text-zinc-100">{formatCurrency(row.totalAccumulated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-800">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#A31616]">O que são Juros Compostos?</h2>
            <p className="text-zinc-400 leading-relaxed">
              Diferente dos juros simples, que incidem apenas sobre o valor inicial, os juros compostos são calculados sobre o montante acumulado de cada período. É o famoso efeito "juros sobre juros".
            </p>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm">
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">A Fórmula Mágica</p>
              <div className="text-3xl font-mono text-[#A31616] mb-4">M = C (1 + i)ᵗ</div>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><strong className="text-zinc-300">M:</strong> Montante final acumulado</li>
                <li><strong className="text-zinc-300">C:</strong> Capital inicial investido</li>
                <li><strong className="text-zinc-300">i:</strong> Taxa de juros (em decimal)</li>
                <li><strong className="text-zinc-300">t:</strong> Tempo de aplicação</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#A31616]">Onde eles se aplicam?</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Investimentos", desc: "CDBs, Tesouro Direto e Ações utilizam esse mecanismo para multiplicar seu patrimônio no longo prazo.", icon: <TrendingUp className="w-5 h-5" /> },
                { title: "Financiamentos", desc: "Bancos utilizam juros compostos em empréstimos e cartões de crédito. Aqui, o efeito é contra você.", icon: <ArrowRight className="w-5 h-5" /> },
                { title: "Contas em Atraso", desc: "Multas e juros de mora costumam ser exponenciais, transformando dívidas pequenas em bolas de neve.", icon: <Info className="w-5 h-5" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm">
                  <div className="bg-[#A31616]/20 p-2 rounded-lg text-[#A31616] h-fit">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Comparison Section */}
        <section className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-center text-[#A31616]">Simples vs. Compostos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-200">
                <div className="w-2 h-8 bg-zinc-700 rounded-full"></div>
                Juros Simples
              </h3>
              <p className="text-zinc-400 text-sm">
                O rendimento é constante. Se você investe R$ 1.000 a 10% ao ano, ganhará R$ 100 todos os anos, independente de quanto tempo passe. O crescimento é linear (uma linha reta).
              </p>
              <div className="p-4 bg-zinc-800 rounded-xl font-mono text-xs text-zinc-500">
                Ex: 100, 110, 120, 130...
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[#A31616]">
                <div className="w-2 h-8 bg-[#A31616] rounded-full"></div>
                Juros Compostos
              </h3>
              <p className="text-zinc-400 text-sm">
                O rendimento é sobre o total. No primeiro ano você ganha R$ 100, no segundo ganha 10% sobre R$ 1.100 (R$ 110). O crescimento é exponencial (uma curva ascendente).
              </p>
              <div className="p-4 bg-[#A31616]/10 rounded-xl font-mono text-xs text-[#A31616]">
                Ex: 100, 110, 121, 133.1...
              </div>
            </div>
          </div>
          <div className="text-center pt-4 italic text-zinc-500 text-sm">
            "Os juros compostos são a oitava maravilha do mundo. Aquele que entende, ganha; aquele que não entende, paga." — Albert Einstein
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="flex justify-center gap-2 items-center text-[#A31616] font-bold">
            <Calculator className="w-5 h-5" />
            Simulador de Juros Compostos
          </div>
          <p className="text-zinc-600 text-sm max-w-md mx-auto">
            Esta ferramenta é apenas para fins educacionais e simulações. Resultados reais podem variar de acordo com impostos e taxas.
          </p>
          <div className="pt-8 text-xs text-zinc-800">
            © 2026 Simulador Financeiro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
