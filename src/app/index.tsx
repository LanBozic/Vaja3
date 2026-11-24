import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAktivnosti } from './_layout';

export default function Index() {
  const [zaslon, setZaslon] = useState<number>(1);
  const { aktivnosti, dodajAktivnost, izbrisiAktivnost } = useAktivnosti();

  const [naslov, setNaslov] = useState<string>('');
  const [vrsta, setVrsta] = useState<string>('Ocena');
  const [datum, setDatum] = useState<string>('');

  const pridobiFiltriraneAktivnosti = (vrstaFiltra: string, dniVnaprej: number) => {
    const danes = new Date();
    const meja = new Date();
    meja.setDate(danes.getDate() + dniVnaprej);

    return aktivnosti.filter((item) => {
      const d = new Date(item.datum);
      return item.vrsta === vrstaFiltra && d >= danes && d <= meja;
    });
  };

  const handleDodaj = () => {
    if (!naslov.trim() || !datum.trim()) return;
    dodajAktivnost(naslov.trim(), vrsta, datum.trim());
    setNaslov('');
    setDatum('');
  };

  const prihodnjeOcene = pridobiFiltriraneAktivnosti('Ocena', 7);
  const prihodnjiSportniDni = pridobiFiltriraneAktivnosti('Sportni den', 30);

  return (
    <SafeAreaView style={styles.kontejner}>
      {zaslon === 1 ? (
        <ScrollView style={styles.vsebina}>
          <Text style={styles.glavniNaslov}>Pregled Šolskih Obveznosti</Text>

          <View style={styles.kartica}>
            <Text style={styles.naslovSekcije}>Prihodnje ocene v naslednjem tednu</Text>
            {prihodnjeOcene.length === 0 ? (
              <Text style={styles.praznoBesedilo}>Ni napovedanih ocen.</Text>
            ) : (
              prihodnjeOcene.map((item) => (
                <View key={item.id} style={styles.elementSeznama}>
                  <Text style={styles.tekstElementa}>📝 {item.naslov}</Text>
                  <Text style={styles.datumElementa}>{item.datum}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.kartica}>
            <Text style={styles.naslovSekcije}>Športni dnevi</Text>
            {prihodnjiSportniDni.length === 0 ? (
              <Text style={styles.praznoBesedilo}>Ni napovedanih športnih dni.</Text>
            ) : (
              prihodnjiSportniDni.map((item) => (
                <View key={item.id} style={styles.elementSeznama}>
                  <Text style={styles.tekstElementa}>⚽ {item.naslov}</Text>
                  <Text style={styles.datumElementa}>{item.datum}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.vsebina}>
          <Text style={styles.glavniNaslov}>Dodajanje Obveznosti</Text>

          <View style={styles.kartica}>
            <TextInput
              style={styles.vnos}
              placeholder="Naslov"
              value={naslov}
              onChangeText={setNaslov}
            />

            <View style={styles.vrstaVrstica}>
              {['Ocena', 'Sportni dan'].map((opcija) => (
                <TouchableOpacity
                  key={opcija}
                  style={[styles.vrstaGumb, vrsta === opcija && styles.aktivnaVrsta]}
                  onPress={() => setVrsta(opcija)}
                >
                  <Text style={[styles.vrstaTekst, vrsta === opcija && styles.aktivniVrstaTekst]}>
                    {opcija}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.vnos}
              placeholder="Datum (YYYY-MM-DD)"
              value={datum}
              onChangeText={setDatum}
            />

            <TouchableOpacity style={styles.gumbDodaj} onPress={handleDodaj}>
              <Text style={styles.gumbTekst}>Dodaj</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.kartica}>
            <Text style={styles.naslovSekcije}>Vse aktivnosti</Text>
            {aktivnosti.length === 0 ? (
              <Text style={styles.praznoBesedilo}>Ni dodanih aktivnosti.</Text>
            ) : (
              aktivnosti.map((item) => (
                <View key={item.id} style={styles.elementSeznama}>
                  <View>
                    <Text style={styles.tekstElementa}>{item.naslov}</Text>
                    <Text style={styles.datumElementa}>{item.vrsta} · {item.datum}</Text>
                  </View>
                  <TouchableOpacity onPress={() => izbrisiAktivnost(item.id)}>
                    <Text style={styles.gumbBrisi}>Briši</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      <View style={styles.navigacija}>
        <TouchableOpacity
          style={[styles.navGumb, zaslon === 1 && styles.aktivnaNav]}
          onPress={() => setZaslon(1)}
        >
          <Text style={styles.navTekst}>Domača Stran</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navGumb, zaslon === 2 && styles.aktivnaNav]}
          onPress={() => setZaslon(2)}
        >
          <Text style={styles.navTekst}>Dodajanje</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  kontejner: { flex: 1, backgroundColor: '#f4f6f8', marginTop: 30 },
  vsebina: { flex: 1, padding: 16 },
  glavniNaslov: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16, textAlign: 'center' },
  kartica: { backgroundColor: '#ffffff', borderRadius: 8, padding: 16, marginBottom: 16, elevation: 2 },
  naslovSekcije: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#34495e' },
  vnos: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 6, padding: 10, marginBottom: 12, backgroundColor: '#fff' },
  vrstaVrstica: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  vrstaGumb: { flex: 1, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#3498db', alignItems: 'center' },
  aktivnaVrsta: { backgroundColor: '#3498db' },
  vrstaTekst: { color: '#3498db', fontWeight: 'bold' },
  aktivniVrstaTekst: { color: '#ffffff' },
  gumbDodaj: { backgroundColor: '#2ecc71', padding: 12, borderRadius: 6, alignItems: 'center' },
  gumbTekst: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  elementSeznama: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  tekstElementa: { fontSize: 15, fontWeight: '500' },
  datumElementa: { fontSize: 13, color: '#7f8c8d' },
  praznoBesedilo: { fontStyle: 'italic', color: '#95a5a6' },
  gumbBrisi: { color: '#e74c3c', fontWeight: 'bold' },
  navigacija: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#bdc3c7', backgroundColor: '#ffffff' },
  navGumb: { flex: 1, padding: 15, alignItems: 'center' },
  aktivnaNav: { borderBottomWidth: 3, borderBottomColor: '#3498db' },
  navTekst: { fontWeight: 'bold', color: '#2c3e50' },
});