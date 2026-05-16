import { NextRequest, NextResponse } from 'next/server';
import { getCareerById } from '../../../lib/careers';

export async function POST(request: NextRequest) {
  try {
    const { careerId, years } = await request.json();

    const career = getCareerById(careerId);
    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    // Mock AI prediction: simulate salary progression
    const baseSalary = career.averageSalary;
    const growthRate = career.growthRate / 100;
    const automationRisk = career.automationRisk / 100;

    // Simple prediction: compound growth, reduced by automation risk
    const effectiveGrowth = growthRate * (1 - automationRisk);
    const futureSalary = baseSalary * Math.pow(1 + effectiveGrowth, years);

    // Job demand: higher growth means higher demand
    const jobDemand = Math.min(100, career.growthRate * 2 + 50);

    // Automation risk remains the same
    const predictedAutomationRisk = career.automationRisk;

    return NextResponse.json({
      career: career.name,
      years,
      currentSalary: baseSalary,
      predictedSalary: Math.round(futureSalary),
      jobDemand,
      automationRisk: predictedAutomationRisk,
      insights: `Based on AI analysis, this career has a ${career.growthRate}% growth rate with ${career.automationRisk}% automation risk. Over ${years} years, your salary could grow to approximately $${Math.round(futureSalary).toLocaleString()}.`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}