'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface FinancialHighlights {
  revenue?: { value: number; change: number; unit: string };
  netProfit?: { value: number; change: number; unit: string };
  totalAssets?: { value: number; unit: string };
  totalEquity?: { value: number; unit: string };
  eps?: { value: number; change: number };
  roe?: { value: number; change: number };
  debtToEquity?: { value: number };
}

interface RevenueBreakdown {
  segment: string;
  value: number;
  percentage: number;
}

interface QuarterlyTrend {
  period: string;
  revenue: number;
  profit: number;
}

interface AnalysisData {
  companyName: string;
  reportType: string;
  reportPeriod: string;
  executiveSummary: string;
  financialHighlights?: FinancialHighlights;
  revenueBreakdown?: RevenueBreakdown[];
  quarterlyTrends?: QuarterlyTrend[];
  keyRatios?: any;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  managementOutlook?: string;
  analystOpinion?: string;
  recommendation?: string;
  riskFactors?: string[];
  dividendInfo?: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const formatCurrency = (value: number, unit: string = 'LKR') => {
  if (value >= 1000000000) {
    return `Rs. ${(value / 1000000000).toFixed(2)} B`;
  } else if (value >= 1000000) {
    return `Rs. ${(value / 1000000).toFixed(2)} M`;
  } else if (value >= 1000) {
    return `Rs. ${(value / 1000).toFixed(2)} K`;
  }
  return `Rs. ${value.toFixed(2)}`;
};

const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  suffix = '' 
}: { 
  title: string; 
  value: string | number; 
  change?: number; 
  icon: any;
  suffix?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}{suffix}</span>
        {change !== undefined && change !== null && (
          <span className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export function FinancialOverview({ data }: { data: AnalysisData }) {
  const highlights = data.financialHighlights;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Revenue"
          value={highlights?.revenue?.value ? formatCurrency(highlights.revenue.value) : 'N/A'}
          change={highlights?.revenue?.change}
          icon={DollarSign}
        />
        <MetricCard
          title="Net Profit"
          value={highlights?.netProfit?.value ? formatCurrency(highlights.netProfit.value) : 'N/A'}
          change={highlights?.netProfit?.change}
          icon={TrendingUp}
        />
        <MetricCard
          title="EPS"
          value={highlights?.eps?.value?.toFixed(2) || 'N/A'}
          change={highlights?.eps?.change}
          icon={Percent}
          suffix=" LKR"
        />
        <MetricCard
          title="ROE"
          value={highlights?.roe?.value?.toFixed(2) || 'N/A'}
          change={highlights?.roe?.change}
          icon={Percent}
          suffix="%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Assets & Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Assets</span>
                <span className="font-semibold">
                  {highlights?.totalAssets?.value ? formatCurrency(highlights.totalAssets.value) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Equity</span>
                <span className="font-semibold">
                  {highlights?.totalEquity?.value ? formatCurrency(highlights.totalEquity.value) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Debt to Equity</span>
                <span className="font-semibold">
                  {highlights?.debtToEquity?.value?.toFixed(2) || 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Financial Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {data.keyRatios && Object.entries(data.keyRatios).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <p className="text-lg font-semibold">
                    {typeof value === 'number' ? value.toFixed(2) : 'N/A'}
                    {['grossProfitMargin', 'netProfitMargin'].includes(key) ? '%' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RevenueBreakdownChart({ data }: { data: RevenueBreakdown[] }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Segment</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, midAngle }) => {
                const entry = data.find((d) => d.segment === name);
                return entry ? `${name}: ${entry.percentage.toFixed(1)}%` : '';
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QuarterlyTrendsChart({ data }: { data: QuarterlyTrend[] }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value)), 
                name === 'revenue' ? 'Revenue' : 'Profit'
              ]} 
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar yAxisId="right" dataKey="profit" fill="#82ca9d" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SWOTAnalysis({ data }: { data: AnalysisData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.strengths?.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Weaknesses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.weaknesses?.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingDown className="w-4 h-4 mt-1 text-red-600 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.opportunities?.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.threats?.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-1 text-orange-600 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';

export function AnalystOpinion({ data }: { data: AnalysisData }) {
  const getRecommendationColor = (rec: string) => {
    switch (rec?.toUpperCase()) {
      case 'BUY': return 'bg-green-100 text-green-800 border-green-300';
      case 'HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'SELL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyst Opinion & Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Recommendation:</span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRecommendationColor(data.recommendation || '')}`}>
            {data.recommendation || 'N/A'}
          </span>
        </div>
        
        {data.analystOpinion && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm leading-relaxed">{data.analystOpinion}</p>
          </div>
        )}

        {data.managementOutlook && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Management Outlook</h4>
            <p className="text-sm text-muted-foreground">{data.managementOutlook}</p>
          </div>
        )}

        {data.riskFactors && data.riskFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Key Risk Factors
            </h4>
            <ul className="space-y-1">
              {data.riskFactors.slice(0, 5).map((risk, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DividendInfo({ data }: { data: AnalysisData }) {
  if (!data.dividendInfo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Dividend Per Share</span>
            <p className="text-lg font-semibold">
              Rs. {data.dividendInfo.dividendPerShare?.toFixed(2) || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Dividend Yield</span>
            <p className="text-lg font-semibold">
              {data.dividendInfo.dividendYield?.toFixed(2) || 'N/A'}%
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Payout Ratio</span>
            <p className="text-lg font-semibold">
              {data.dividendInfo.payoutRatio?.toFixed(2) || 'N/A'}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
