import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Aktivnost {
  id: string;
  naslov: string;
  vrsta: string;
  datum: string;
}

interface AktivnostiContextType {
  aktivnosti: Aktivnost[];
  dodajAktivnost: (naslov: string, vrsta: string, datum: string) => void;
  izbrisiAktivnost: (id: string) => void;
}

const AktivnostiContext = createContext<AktivnostiContextType>({
  aktivnosti: [],
  dodajAktivnost: () => {},
  izbrisiAktivnost: () => {},
});

export const useAktivnosti = () => useContext(AktivnostiContext);

export default function RootLayout() {
  const [aktivnosti, setAktivnosti] = useState<Aktivnost[]>([]);

  useEffect(() => {
    naloziPodatke();
  }, []);

  useEffect(() => {
    shraniPodatke(aktivnosti);
  }, [aktivnosti]);

  const shraniPodatke = async (podatki: Aktivnost[]) => {
    try {
      await AsyncStorage.setItem('@solski_podatki', JSON.stringify(podatki));
    } catch (e) {
      console.log(e);
    }
  };

  const naloziPodatke = async () => {
    try {
      const shranjeno = await AsyncStorage.getItem('@solski_podatki');
      if (shranjeno !== null) {
        setAktivnosti(JSON.parse(shranjeno) as Aktivnost[]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dodajAktivnost = (naslov: string, vrsta: string, datum: string) => {
    const nova: Aktivnost = {
      id: Date.now().toString(),
      naslov,
      vrsta,
      datum,
    };
    setAktivnosti((prev) => [...prev, nova]);
  };

  const izbrisiAktivnost = (id: string) => {
    setAktivnosti((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AktivnostiContext.Provider value={{ aktivnosti, dodajAktivnost, izbrisiAktivnost }}>
      <Stack screenOptions={{ headerShown: false }} />
    </AktivnostiContext.Provider>
  );
}