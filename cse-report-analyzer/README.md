# CSE Report Analyzer

An AI-powered annual/quarterly report analyzer for Colombo Stock Exchange (CSE) listed companies. Upload PDF reports and get comprehensive financial insights, visual charts, and expert analysis powered by Google's Gemini AI.

## Features

- **PDF Upload**: Drag and drop or select annual/quarterly reports in PDF format
- **AI-Powered Analysis**: Extracts and analyzes financial data using Google Gemini AI
- **Financial Highlights**: View key metrics like Revenue, Net Profit, EPS, ROE, and more
- **Visual Charts**: 
  - Revenue breakdown by segment (Pie chart)
  - Quarterly performance trends (Bar chart)
- **SWOT Analysis**: Comprehensive Strengths, Weaknesses, Opportunities, and Threats analysis
- **Expert Opinion**: AI-generated analyst recommendations (BUY/HOLD/SELL)
- **Dividend Information**: Dividend per share, yield, and payout ratio
- **Risk Factors**: Key risks identified from the report

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cse-report-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to the application
2. Upload a PDF annual or quarterly report from a CSE-listed company
3. Wait for the AI to analyze the report (may take 30-60 seconds for large documents)
4. Review the comprehensive analysis including:
   - Executive summary
   - Financial highlights with trend indicators
   - Visual charts showing revenue breakdown and quarterly trends
   - SWOT analysis
   - Analyst opinion and recommendation
   - Dividend information
   - Key risk factors

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: ShadCN UI, Tailwind CSS
- **Charts**: Recharts
- **AI**: Google Generative AI (Gemini)
- **PDF Processing**: PDF.js
- **File Upload**: react-dropzone

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for report analysis
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── analysis/
│   │   ├── charts.tsx             # Chart components
│   │   ├── file-upload.tsx        # File upload component
│   │   └── report-analyzer.tsx    # Main analyzer component
│   └── ui/
│       ├── button.tsx             # Button component
│       └── card.tsx               # Card component
└── lib/
    └── utils.ts                   # Utility functions
```

## Supported Report Types

- Annual Reports
- Quarterly Financial Statements
- Interim Reports
- Any financial report from CSE-listed companies in PDF format

## Limitations

- PDF files must be text-based (scanned images may not work well)
- Large reports may take longer to process
- The AI analysis is limited to ~50,000 characters of extracted text
- Some complex tables or charts in PDFs may not be fully captured

## Disclaimer

This tool provides AI-generated analysis for informational purposes only. It should not be considered as financial advice. Always conduct your own research and consult with qualified financial advisors before making investment decisions.

## License

MIT
