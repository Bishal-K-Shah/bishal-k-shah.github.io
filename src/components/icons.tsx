import { Car, Cpu, CircuitBoard, Server } from 'lucide-react';
import type { Category, CategoryInfo } from '@/types';

export const categoryInfo: Record<Category, CategoryInfo> = {
  Automobile: { name: 'Automobile', icon: Car },
  Technology: { name: 'Technology', icon: Cpu },
  Electronics: { name: 'Electronics', icon: CircuitBoard },
  HomeLab: { name: 'HomeLab', icon: Server },
};
