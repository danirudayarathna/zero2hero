'use client';

import { useState } from 'react';
import { FileUpload } from './file-upload';
import { 
  FinancialOverview, 
  RevenueBreakdownChart, 
  QuarterlyTrendsChart, 
  SWOTAnalysis, 
  AnalystOpinion,
  DividendInfo 
} from './charts';
import { Building2, FileText, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalysisData {
  companyName: string;
  reportType: string;
  reportPeriod: string;
  executiveSummary: string;
  financialHighlights?: any;
  revenueBreakdown?: any[];
  quarterlyTrends?: any[];
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

export function ReportAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleFileUploaded = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze report');
      }

      setAnalysisData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  if (analysisData) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">{analysisData.companyName}</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {analysisData.reportType} Report
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {analysisData.reportPeriod}
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={handleReset}>
                Analyze Another Report
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {analysisData.executiveSummary}
            </p>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <FinancialOverview data={analysisData} />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {analysisData.revenueBreakdown && analysisData.revenueBreakdown.length > 0 && (
            <RevenueBreakdownChart data={analysisData.revenueBreakdown} />
          )}
          {analysisData.quarterlyTrends && analysisData.quarterlyTrends.length > 0 && (
            <QuarterlyTrendsChart data={analysisData.quarterlyTrends} />
          )}
        </div>

        {/* SWOT Analysis */}
        {(analysisData.strengths || analysisData.weaknesses || analysisData.opportunities || analysisData.threats) && (
          <div>
            <h3 className="text-xl font-semibold mb-4">SWOT Analysis</h3>
            <SWOTAnalysis data={analysisData} />
          </div>
        )}

        {/* Analyst Opinion */}
        {(analysisData.analystOpinion || analysisData.recommendation || analysisData.riskFactors) && (
          <AnalystOpinion data={analysisData} />
        )}

        {/* Dividend Info */}
        {analysisData.dividendInfo && (
          <DividendInfo data={analysisData} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">CSE Report Analyzer</h1>
        <p className="text-muted-foreground">
          Upload annual or quarterly reports from Colombo Stock Exchange listed companies 
          to get AI-powered insights and analysis.
        </p>
      </div>

      <FileUpload onFileUploaded={handleFileUploaded} isLoading={isLoading} />

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Financial Highlights</p>
                  <p className="text-xs text-muted-foreground">Revenue, Profit, EPS & more</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Visual Charts</p>
                  <p className="text-xs text-muted-foreground">Trends & breakdowns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Expert Analysis</p>
                  <p className="text-xs text-muted-foreground">SWOT & recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
