export type EquipmentStatus = '완료' | '미완료';

export interface EquipmentLog {
  id: string;
  sn: string;
  customer?: string;
  receiver?: string;
  spec?: string;
  faultType?: string;
  receiveNote?: string;
  checkNote?: string;
  material?: string;
  quantity?: number;
  createdAt: string;
  status: EquipmentStatus;
  completeDate?: string;
}
