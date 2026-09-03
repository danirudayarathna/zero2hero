import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  
  // Set worker source
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${require('pdfjs-dist/package.json').version}/pdf.worker.min.mjs`;
  
  const loadingTask = getDocument(new Uint8Array(pdfBuffer));
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}\n`;
  }
  
  return fullText;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }
    
    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdfText = await extractTextFromPDF(arrayBuffer);
    
    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }
    
    // Limit text to avoid token limits (approximately 50k characters for safety)
    const truncatedText = pdfText.slice(0, 50000);
    
    // Create prompt for Gemini
    const prompt = `You are an expert financial analyst specializing in Colombo Stock Exchange (CSE) listed companies. Analyze the following annual/quarterly report and provide comprehensive insights.

REPORT TEXT:
${truncatedText}

Please provide your analysis in the following JSON format:

{
  "companyName": "Company name",
  "reportType": "Annual or Quarterly",
  "reportPeriod": "e.g., 2023/2024 or Q1 2024",
  "executiveSummary": "Brief summary of key highlights",
  "financialHighlights": {
    "revenue": {"value": number, "change": number, "unit": "LKR"},
    "netProfit": {"value": number, "change": number, "unit": "LKR"},
    "totalAssets": {"value": number, "unit": "LKR"},
    "totalEquity": {"value": number, "unit": "LKR"},
    "eps": {"value": number, "change": number},
    "roe": {"value": number, "change": number},
    "debtToEquity": {"value": number}
  },
  "revenueBreakdown": [
    {"segment": "Segment name", "value": number, "percentage": number}
  ],
  "quarterlyTrends": [
    {"period": "Q1/Q2/Q3/Q4", "revenue": number, "profit": number}
  ],
  "keyRatios": {
    "currentRatio": number,
    "quickRatio": number,
    "grossProfitMargin": number,
    "netProfitMargin": number,
    "assetTurnover": number,
    "peRatio": number
  },
  "strengths": ["list of strengths"],
  "weaknesses": ["list of weaknesses"],
  "opportunities": ["list of opportunities"],
  "threats": ["list of threats"],
  "managementOutlook": "Management's view on future prospects",
  "analystOpinion": "Your professional opinion as an analyst",
  "recommendation": "BUY/HOLD/SELL",
  "riskFactors": ["list of key risks"],
  "dividendInfo": {
    "dividendPerShare": number,
    "dividendYield": number,
    "payoutRatio": number
  }
}

Focus on Sri Lankan market context, CSE listing requirements, and local economic conditions. If certain data is not available in the report, use null values.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }
    
    try {
      const analysis = JSON.parse(responseText);
      return NextResponse.json({ success: true, data: analysis });
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse analysis results',
          rawResponse: responseText.substring(0, 500)
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
