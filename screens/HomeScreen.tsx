import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EquipmentLog } from '../types/Equipment';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [equipmentList, setEquipmentList] = useState<EquipmentLog[]>([]);
  const [filterStatus, setFilterStatus] = useState<'전체' | '완료' | '미완료'>('전체');

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('equipmentLogs');
      const parsed = saved ? JSON.parse(saved) : [];
      setEquipmentList(parsed);
    };
    loadData();
  }, []);

  const filteredList = equipmentList.filter(item => {
    const matchStatus = filterStatus === '전체' || item.status === filterStatus;
    const matchSearch = item.sn.includes(searchText);
    return matchStatus && matchSearch;
  });

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="S/N 검색"
        value={searchText}
        onChangeText={setSearchText}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
        {['전체', '완료', '미완료'].map(status => (
          <Button key={status} title={status} onPress={() => setFilterStatus(status as any)} />
        ))}
      </View>
      <FlatList
        data={filteredList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('장비 이력 입력', { equipment: item })}>
            <Text>{item.sn} - {item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="장비 이력 입력" onPress={() => navigation.navigate('장비 이력 입력')} />
    </View>
  );
};

export default HomeScreen;
