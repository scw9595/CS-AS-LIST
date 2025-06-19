import React, { useState } from 'react';
import { View, TextInput, Text, Button, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EquipmentLog } from '../types/Equipment';

const faultTypes = ['HW BLOCK', 'H/W PCB BD', '성능', '점검', '초기불량', '원인미도출', '교정', '복합', 'S/W', '납품', '기타'];

const EquipmentInputScreen = () => {
  const route = useRoute<RouteProp<any>>();
  const existing = route.params?.equipment as EquipmentLog | undefined;

  const [equipment, setEquipment] = useState<EquipmentLog>({
    id: existing?.id || Date.now().toString(),
    sn: existing?.sn || '',
    customer: existing?.customer || '',
    receiver: existing?.receiver || '',
    spec: existing?.spec || '',
    faultType: existing?.faultType || '',
    receiveNote: existing?.receiveNote || '',
    checkNote: existing?.checkNote || '',
    material: existing?.material || '',
    quantity: existing?.quantity || 0,
    createdAt: existing?.createdAt || new Date().toISOString(),
    status: existing?.status || '미완료',
    completeDate: existing?.completeDate || ''
  });

  const updateField = (field: keyof EquipmentLog, value: any) => {
    setEquipment({ ...equipment, [field]: value });
  };

  const save = async () => {
    if (!equipment.sn && !equipment.customer && !equipment.receiver && !equipment.receiveNote && !equipment.checkNote) {
      alert('최소 하나 이상의 항목을 입력해야 합니다.');
      return;
    }
    const saved = await AsyncStorage.getItem('equipmentLogs');
    const logs = saved ? JSON.parse(saved) : [];
    const updatedLogs = logs.filter((log: EquipmentLog) => log.id !== equipment.id);
    updatedLogs.push(equipment);
    await AsyncStorage.setItem('equipmentLogs', JSON.stringify(updatedLogs));
    alert('저장되었습니다.');
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <TextInput placeholder="고객사" value={equipment.customer} onChangeText={text => updateField('customer', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <TextInput placeholder="접수자" value={equipment.receiver} onChangeText={text => updateField('receiver', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <TextInput placeholder="S/N" value={equipment.sn} onChangeText={text => updateField('sn', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <TextInput placeholder="장비 스펙" value={equipment.spec} onChangeText={text => updateField('spec', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <Text>고장유형</Text>
      {faultTypes.map(type => (
        <Button key={type} title={type} onPress={() => updateField('faultType', type)} />
      ))}
      <TextInput placeholder="접수 내용" value={equipment.receiveNote} onChangeText={text => updateField('receiveNote', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <TextInput placeholder="점검 내용" value={equipment.checkNote} onChangeText={text => updateField('checkNote', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <TextInput placeholder="자재" value={equipment.material} onChangeText={text => updateField('material', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      <TextInput placeholder="수량" value={equipment.quantity.toString()} onChangeText={text => updateField('quantity', Number(text))} style={{ borderWidth: 1, marginBottom: 8 }} />
      <Text>상태: {equipment.status}</Text>
      <Button title={equipment.status === '완료' ? '미완료로 변경' : '완료로 변경'} onPress={() => updateField('status', equipment.status === '완료' ? '미완료' : '완료')} />
      {equipment.status === '완료' && (
        <TextInput placeholder="완료일 (예: 2025-06-19)" value={equipment.completeDate} onChangeText={text => updateField('completeDate', text)} style={{ borderWidth: 1, marginBottom: 8 }} />
      )}
      <Button title="저장" onPress={save} />
    </ScrollView>
  );
};

export default EquipmentInputScreen;
