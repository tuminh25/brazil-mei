'use client';

import { 
  HousingIcon, TransportIcon, MoneyIcon, FoodIcon, 
  HealthcareIcon, StudyIcon, LifestyleIcon, WorkIcon,
  CalculatorIcon, PlannerIcon, TransportCostIcon, SchoolIcon,
  HawkerIcon, ClinicIcon, SalaryIcon, MapIcon,
  DiamondIcon, HexagonIcon, SparkleIcon,
  ReceiptIcon, ChecklistIcon, UserIcon, TagIcon,
  CalendarIcon, BankIcon, GiftIcon, AlertIcon, InfoIcon, CheckIcon, XIcon,
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
  clinic: ClinicIcon,
  salary: SalaryIcon,
  map: MapIcon,
  diamond: DiamondIcon,
  hexagon: HexagonIcon,
  sparkle: SparkleIcon,
  receipt: ReceiptIcon,
  checklist: ChecklistIcon,
  user: UserIcon,
  tag: TagIcon,
  calendar: CalendarIcon,
  bank: BankIcon,
  gift: GiftIcon,
  alert: AlertIcon,
  info: InfoIcon,
  check: CheckIcon,
  x: XIcon,
};

interface TopicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TopicIcon({ name, className, style }: TopicIconProps) {
  const Icon = iconMap[name] || DiamondIcon;
  return <span style={style}><Icon className={className} aria-hidden="true" /></span>;
}