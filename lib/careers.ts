export interface Career {
  id: string;
  name: string;
  description: string;
  averageSalary: number;
  growthRate: number; // percentage
  automationRisk: number; // 0-100
  category: string;
}

export const careers: Career[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Develop software applications and systems.',
    averageSalary: 120000,
    growthRate: 22,
    automationRisk: 15,
    category: 'Technology',
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analyze data to extract insights.',
    averageSalary: 130000,
    growthRate: 36,
    automationRisk: 20,
    category: 'Technology',
  },
  {
    id: 'nurse',
    name: 'Registered Nurse',
    description: 'Provide patient care in healthcare settings.',
    averageSalary: 75000,
    growthRate: 6,
    automationRisk: 5,
    category: 'Healthcare',
  },
  {
    id: 'teacher',
    name: 'High School Teacher',
    description: 'Educate students in secondary schools.',
    averageSalary: 60000,
    growthRate: 4,
    automationRisk: 10,
    category: 'Education',
  },
  {
    id: 'marketing-manager',
    name: 'Marketing Manager',
    description: 'Oversee marketing strategies and campaigns.',
    averageSalary: 95000,
    growthRate: 10,
    automationRisk: 25,
    category: 'Business',
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    description: 'Design user interfaces and experiences.',
    averageSalary: 90000,
    growthRate: 18,
    automationRisk: 30,
    category: 'Design',
  },
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    description: 'Analyze financial data and trends.',
    averageSalary: 85000,
    growthRate: 8,
    automationRisk: 35,
    category: 'Finance',
  },
  {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    description: 'Design and build mechanical systems.',
    averageSalary: 95000,
    growthRate: 5,
    automationRisk: 20,
    category: 'Engineering',
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    description: 'Create visual content and designs.',
    averageSalary: 55000,
    growthRate: 3,
    automationRisk: 40,
    category: 'Design',
  },
  {
    id: 'sales-representative',
    name: 'Sales Representative',
    description: 'Sell products and services to customers.',
    averageSalary: 65000,
    growthRate: 7,
    automationRisk: 50,
    category: 'Sales',
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    description: 'Protect systems from cyber threats.',
    averageSalary: 110000,
    growthRate: 32,
    automationRisk: 10,
    category: 'Technology',
  },
  {
    id: 'physician',
    name: 'Physician',
    description: 'Diagnose and treat medical conditions.',
    averageSalary: 200000,
    growthRate: 4,
    automationRisk: 2,
    category: 'Healthcare',
  },
];

export function getCareerById(id: string): Career | undefined {
  return careers.find(c => c.id === id);
}

export function getCareersByCategory(category: string): Career[] {
  return careers.filter(c => c.category === category);
}