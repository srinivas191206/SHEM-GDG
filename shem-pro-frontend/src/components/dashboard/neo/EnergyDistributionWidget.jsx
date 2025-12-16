import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { useThemeColors } from '../../../context/ThemeContext.tsx';

const EnergyDistributionWidget = () => {
    const { t } = useTranslation();
    const themeColors = useThemeColors();

    const data = [
        { name: t('analytics.lighting'), value: 15 },
        { name: t('analytics.acHvac'), value: 45 },
        { name: t('analytics.appliances'), value: 30 },
        { name: t('analytics.others'), value: 10 },
    ];

    const COLORS = ['#f7b529', '#8b7ff4', '#22c55e', '#ef4444'];

    return (
        <div className="bg-dashboard-card rounded-xl p-4 md:p-6 border border-dashboard-textSecondary/10 h-full w-full min-w-0 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-dashboard-text font-bold text-lg mb-1">{t('analytics.energyBreakdown')}</h3>
                    <p className="text-dashboard-textSecondary text-xs">{t('analytics.simulatedDistribution')}</p>
                </div>
                <button className="p-1.5 hover:bg-dashboard-text/5 rounded-lg text-dashboard-textSecondary transition-colors">
                    <EllipsisHorizontalIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="flex items-center justify-between">
                {/* Chart */}
                <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={75}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}`, borderRadius: '8px' }}
                                itemStyle={{ color: themeColors.text }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-dashboard-text font-bold text-xl">100%</span>
                        <span className="text-dashboard-textSecondary text-[10px] uppercase tracking-wider">{t('analytics.total')}</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 ml-8 space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex justify-between items-center group">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                                <span className="text-sm text-dashboard-textSecondary group-hover:text-dashboard-text transition-colors">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-bold text-dashboard-text">{item.value}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnergyDistributionWidget;
