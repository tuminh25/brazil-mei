'use client';

import { 
  HousingIcon, TransportIcon, MoneyIcon, FoodIcon, 
  HealthcareIcon, StudyIcon, LifestyleIcon, WorkIcon,
  CalculatorIcon, PlannerIcon, TransportCostIcon, SchoolIcon,
  HawkerIcon, ClinicIcon, SalaryIcon, MapIcon,
  DiamondIcon, HexagonIcon, SparkleIcon,
} from './Icons';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  housing: HousingIcon,
  transport: TransportIcon,
  money: MoneyIcon,
  food: FoodIcon,
  healthcare: HealthcareIcon,
  study: StudyIcon,
  lifestyle: LifestyleIcon,
  work: WorkIcon,
  calculator: CalculatorIcon,
  planner: PlannerIcon,
  transportCost: TransportCostIcon,
  school: SchoolIcon,
  hawker: HawkerIcon,
  clinic: ClinicIcon,
  salary: SalaryIcon,
  map: MapIcon,
  diamond: DiamondIcon,
  hexagon: HexagonIcon,
  sparkle: SparkleIcon,
};

interface TopicIconProps {
  name: string;
  className?: string;
}

export function TopicIcon({ name, className }: TopicIconProps) {
  const Icon = iconMap[name] || DiamondIcon;
  return <Icon className={className} aria-hidden="true" />;
}