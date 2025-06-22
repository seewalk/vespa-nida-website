// app/privatumo-politika/page.js
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privatumo politika | Vespa Nida',
  description: 'Išsami privatumo politika, paaiškinanti, kaip Vespa Nida tvarko jūsų asmens duomenis ir saugo privatumą.',
  robots: { index: true, follow: true }
};

export default function PrivacyPolicy() {
  return (
    <main>
      <Header />
      <section className="py-24 bg-ivory-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-graphite-black mb-8 font-syne">
              Privatumo politika
            </h1>
            
            <div className="prose prose-lg max-w-none text-graphite-black/70">
              <p className="mb-6">
                <strong>Paskutinį kartą atnaujinta:</strong> {new Date().toLocaleDateString('lt-LT')}<br/>
                <strong>Versija:</strong> 1.0<br/>
                <strong>Įsigaliojimo data:</strong> {new Date().toLocaleDateString('lt-LT')}
              </p>
              
              <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-graphite-black mb-3">Jūsų teisės pagal BDAR</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ul className="space-y-2">
                    <li>✓ Teisė į informaciją ir prieigą</li>
                    <li>✓ Teisė į duomenų taisymą</li>
                    <li>✓ Teisė į ištrynimą („teisė būti pamirštam")</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>✓ Teisė apriboti duomenų tvarkymą</li>
                    <li>✓ Teisė į duomenų perkeliamumą</li>
                    <li>✓ Teisė nesutikti su duomenų tvarkymu</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Kas mes esame
              </h2>
              <div className="bg-white border border-sand-beige rounded-lg p-6 mb-6">
                <p className="mb-4">
                  <strong>Vespa Nida</strong> yra premium Vespa skuterių nuomos paslauga, įsikūrusi Nidoje, Lietuvoje. 
                  Mes teikiame aukštos kokybės skuterių nuomą Kuršių nerijos tyrimui. Vespa Nida yra nepriklausoma nuomos paslauga, nesusijusi su Piaggio & Co S.p.A. ar Vespa prekės ženklu ir jų nereklamuojama.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Kontaktai:</strong></p>
                    <ul className="space-y-1 text-sm">
                      <li>Svetainė: vespanida.lt</li>
                      <li>El. paštas: info@vespanida.lt</li>
                      <li>Telefonas: +370 679 56380</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Verslo duomenys:</strong></p>
                    <ul className="space-y-1 text-sm">
                      <li>Adresas: Nida, Lietuva</li>
                      <li>Darbo laikas: Pir-Pen 9:00-18:00</li>
                      <li>Savaitgaliais: 10:00-16:00</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Kokią informaciją renkame
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-graphite-black">2.1 Rezervacijos informacija</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold mb-2">Asmeniniai duomenys:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Vardas ir pavardė</li>
                        <li>• El. pašto adresas</li>
                        <li>• Telefono numeris</li>
                        <li>• Gimimo data (amžiaus patikrinimui)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Nuomos informacija:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Pageidaujamos datos</li>
                        <li>• Skuterio modelis</li>
                        <li>• Nuomos trukmė</li>
                        <li>• Vairuotojo pažymėjimo duomenys</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-graphite-black">2.2 Svetainės naudojimo duomenys</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold mb-2">Techninė informacija:</p>
                      <ul className="text-sm space-y-1">
                        <li>• IP adresas (užšifruotas privatumui)</li>
                        <li>• Naršyklės tipas ir versija</li>
                        <li>• Įrenginio informacija</li>
                        <li>• Operacinė sistema</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Naudojimo analitika:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Aplankyti puslapiai</li>
                        <li>• Svetainėje praleistas laikas</li>
                        <li>• Vartotojo sąveikos (tik su sutikimu)</li>
                        <li>• Slapukai (žr. slapukų politiką)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-graphite-black">2.3 Komunikacijos įrašai</h3>
                  <ul className="text-sm space-y-1">
                    <li>• El. pašto susirašinėjimas</li>
                    <li>• Telefono skambučių įrašai (paslaugų kokybei)</li>
                    <li>• Klientų aptarnavimo sąveikos</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Kaip naudojame jūsų informaciją
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-graphite-black">3.1 Būtinosios paslaugos</h3>
                  <p className="mb-3"><strong>Teisinis pagrindas:</strong> Sutarties vykdymas (BDAR 6 str. 1 d. b p.)</p>
                  <ul className="space-y-2">
                    <li>✓ Rezervacijų apdorojimas ir patvirtinimas</li>
                    <li>✓ Skuterių nuomos paslaugų teikimas</li>
                    <li>✓ Vairuotojo pažymėjimų ir amžiaus patikrinimas</li>
                    <li>✓ Klientų aptarnavimas ir problemų sprendimas</li>
                    <li>✓ Atitikimas Lietuvos ir ES reglamentams</li>
                  </ul>
                </div>

                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-graphite-black">3.2 Su jūsų sutikimu</h3>
                  <p className="mb-3"><strong>Teisinis pagrindas:</strong> Sutikimas (BDAR 6 str. 1 d. a p.)</p>
                  <ul className="space-y-2">
                    <li>• Rinkodaros komunikacija ir pasiūlymai</li>
                    <li>• Svetainės analitika ir tobulinimas</li>
                    <li>• Personalizuotas turinys ir patirtis</li>
                    <li>• Socialinių tinklų integracija</li>
                  </ul>
                </div>

                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-graphite-black">3.3 Teisėti interesai</h3>
                  <p className="mb-3"><strong>Teisinis pagrindas:</strong> Teisėtas interesas (BDAR 6 str. 1 d. f p.)</p>
                  <ul className="space-y-2">
                    <li>• Sukčiavimo prevencija ir saugumas</li>
                    <li>• Verslo operacijų valdymas</li>
                    <li>• Svetainės sauga nuo kibernetinių grėsmių</li>
                    <li>• Vidaus apskaita ir analizė</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Duomenų dalijimasis ir atskleidimas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-sage-green">Dalinamės duomenimis su:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Mokėjimo procesoriais (saugiems atsiskaitymams)</li>
                    <li>✓ Analitikos paslaugų teikėjais (su sutikimu)</li>
                    <li>✓ El. pašto paslaugomis (patvirtinimams)</li>
                    <li>✓ Teisėsaugos institucijomis (kai reikalauja įstatymas)</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3 text-red-800">Niekada nedarome:</h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>✗ Neparduodame duomenų trečiosioms šalims</li>
                    <li>✗ Nedalinamės duomenų netiesioginiais tikslais</li>
                    <li>✗ Neperduodame už ES ribų be apsaugos</li>
                    <li>✗ Nenaudojame automatizuotam sprendimų priėmimui</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Duomenų saugojimo laikotarpiai
              </h2>
              
              <div className="bg-white border border-sand-beige rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3">Verslo duomenys:</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Rezervacijų įrašai:</strong> 7 metai (Lietuvos verslo įstatymas)</li>
                      <li><strong>El. pašto komunikacija:</strong> 3 metai nuo paskutinės sąveikos</li>
                      <li><strong>Klientų aptarnavimo įrašai:</strong> 2 metai</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">Rinkodaros duomenys:</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Rinkodaros sutikimai:</strong> 3 metai arba iki atšaukimo</li>
                      <li><strong>Svetainės analitika:</strong> Maks. 26 mėnesiai</li>
                      <li><strong>Slapukų sutikimai:</strong> 1 metai nuo surinkimo</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Duomenų sauga
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3">Techninės priemonės:</h3>
                  <ul className="text-sm space-y-2">
                    <li>🔒 Šifravimas perdavimo ir saugojimo metu</li>
                    <li>👥 Ribota darbuotojų prieiga</li>
                    <li>📊 Nuolatinis saugumo stebėjimas</li>
                    <li>💾 Saugūs, šifruoti atsarginiai duomenys</li>
                    <li>🔥 Firebase Enterprise saugumas</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3">Organizacinės priemonės:</h3>
                  <ul className="text-sm space-y-2">
                    <li>📚 Reguliarūs darbuotojų mokymai</li>
                    <li>📋 Išsamūs duomenų apsaugos protokolai</li>
                    <li>🔍 Reguliarūs saugumo vertinimai</li>
                    <li>⚡ Incidentų reagavimo procedūros</li>
                    <li>📞 24/7 saugumo stebėjimas</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Jūsų teisių įgyvendinimas
              </h2>
              
              <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3">Kontaktai teisių įgyvendinimui:</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>El. paštas:</strong> privatumas@vespanida.lt</li>
                      <li><strong>Telefonas:</strong> +370 679 56380</li>
                      <li><strong>Paštas:</strong> Vespa Nida, Nida, Lietuva</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">Atsakymo terminai:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Standartiniai prašymai: 30 dienų</li>
                      <li>• Sudėtingi prašymai: iki 90 dienų</li>
                      <li>• Skubūs prašymai: 72 valandos</li>
                      <li>• Tapatybės patvirtinimas: gali būti reikalingas</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Tarptautiniai duomenų perdavimai
              </h2>
              
              <div className="bg-white border border-sand-beige rounded-lg p-6 mb-8">
                <ul className="space-y-3">
                  <li>
                    <strong>Pirminis saugojimas:</strong> Visi duomenys saugomi Europos Sąjungoje (Google Cloud EU)
                  </li>
                  <li>
                    <strong>Paslaugų teikėjai:</strong> Naudojame tik ES bazėje esančius arba tinkamo sprendimo šalių teikėjus
                  </li>
                  <li>
                    <strong>Apsaugos priemonės:</strong> Visi perdavimai apsaugoti tinkamomis garantijomis (BDAR 46 str.)
                  </li>
                  <li>
                    <strong>Firebase/Google:</strong> Duomenų tvarkymo sutartis su ES standartinėmis sutartinėmis sąlygomis
                  </li>
                </ul>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Skundai ir priežiūros institucijos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3">Vidinis skundų nagrinėjimas:</h3>
                  <p className="mb-3">Duomenų apsaugos pareigūnas:</p>
                  <ul className="text-sm space-y-1">
                    <li>El. paštas: dap@vespanida.lt</li>
                    <li>Atsakymo laikas: 14 dienų</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-sand-beige rounded-lg p-6">
                  <h3 className="font-bold mb-3">Išorinis skundų nagrinėjimas:</h3>
                  <p className="mb-2"><strong>Valstybinė duomenų apsaugos inspekcija:</strong></p>
                  <ul className="text-sm space-y-1">
                    <li>Svetainė: <a href="https://vdai.lrv.lt" target="_blank" rel="noopener noreferrer" className="text-sage-green hover:underline">vdai.lrv.lt</a></li>
                    <li>El. paštas: ada@vdai.lrv.lt</li>
                    <li>Adresas: A. Juozapavičiaus g. 6, LT-09310 Vilnius</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Vaikų privatumas
              </h2>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <ul className="space-y-2">
                  <li>• Mes sąmoningai nerenkame duomenų iš vaikų iki 16 metų</li>
                  <li>• Mūsų paslaugos skirtos tik suaugusiesiems</li>
                  <li>• Amžiaus patikrinimas reikalingas visoms rezervacijoms</li>
                  <li>• Nepilnamečiams rezervacijas turi atlikti tėvai/globėjai</li>
                </ul>
              </div>
              
              <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
                Politikos atnaujinimai
              </h2>
              
              <div className="bg-white border border-sand-beige rounded-lg p-6 mb-8">
                <ul className="space-y-2">
                  <li><strong>Pranešimas:</strong> Praneš apie reikšmingus pakeitimus</li>
                  <li><strong>Sutikimas:</strong> Naujam sutikimui gali prireikti esminių pakeitimų atveju</li>
                  <li><strong>Versijų istorija:</strong> Ankstesnės versijos preinamos pareikalavus</li>
                  <li><strong>Peržiūros grafikas:</strong> Metin politikos peržiūra ir atnaujinimai</li>
                </ul>
              </div>
              
              <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-graphite-black mb-3">
                  Susisiekkite su mumis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Duomenų valdytojas:</strong> Vespa Nida</p>
                    <p><strong>El. paštas:</strong> privatumas@vespanida.lt</p>
                    <p><strong>Telefonas:</strong> +370 679 56380</p>
                  </div>
                  <div>
                    <p><strong>Darbo laikas:</strong></p>
                    <p>Pirmadienį-Penktadienį: 9:00-18:00</p>
                    <p>Savaitgaliais: 10:00-16:00</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-sand-beige pt-6">
                <p className="text-sm text-graphite-black/60 mb-4">
                  Ši privatumo politika sukurta laikantis BDAR, el. privatumo direktyvos ir kitų taikomų 
                  duomenų apsaugos įstatymų. Ji atspindi mūsų įsipareigojimą saugoti jūsų privatumą ir 
                  užtikrinta skaidrų duomenų tvarkymą.
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link href="/slapukai" className="text-sage-green hover:underline">
                    Slapukų politika
                  </Link>
                  <Link href="/slapuku-nustatymai" className="text-sage-green hover:underline">
                    Slapukų nustatymai
                  </Link>
                  <Link href="/paslaugos-teikimo-salygos" className="text-sage-green hover:underline">
                    Paslaugų teikimo sąlygos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}