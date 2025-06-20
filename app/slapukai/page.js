// app/slapukai/page.js
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Slapukų politika | Vespa Nida',
  description: 'Išsami slapukų politika, paaiškinanti, kaip Vespa Nida naudoja slapukus ir jūsų privatumo teises.',
  robots: { index: true, follow: true }
};

export default function CookiesPolicy() {
  return (
    <main>
        <Header />
    <section className="py-24 bg-ivory-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-graphite-black mb-8 font-syne">
            Slapukų politika
          </h1>
          
          <div className="prose prose-lg max-w-none text-graphite-black/70">
            <p className="mb-6">
              <strong>Paskutinį kartą atnaujinta:</strong> {new Date().toLocaleDateString('lt-LT')}<br/>
              <strong>Įsigaliojimo data:</strong> {new Date().toLocaleDateString('lt-LT')}
            </p>
            
            <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-graphite-black mb-3">Jūsų teisės pagal BDAR</h2>
              <ul className="space-y-2">
                <li>✓ Teisė būti informuotam apie duomenų rinkimą</li>
                <li>✓ Teisė gauti prieigą prie savo asmens duomenų</li>
                <li>✓ Teisė bet kada atšaukti sutikimą</li>
                <li>✓ Teisė į duomenų perkeliamumą ir ištrynimą</li>
                <li>✓ Teisė nesutikti su duomenų tvarkymu</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Kas yra slapukai?
            </h2>
            <p className="mb-6">
              Slapukai yra maži tekstiniai failai, kurie saugomi jūsų įrenginyje, kai lankotės mūsų svetainėje. 
              Mes naudojame slapukus laikydamiesi ES Bendrosios duomenų apsaugos reglamento (BDAR) 
              ir kitų taikomų privatumo įstatymų.
            </p>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Teisinis duomenų tvarkymo pagrindas
            </h2>
            <div className="bg-white border border-sand-beige rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-3">Būtini slapukai</h3>
              <p className="mb-2"><strong>Teisinis pagrindas:</strong> Teisėtas interesas (BDAR 6 str. 1 d. f p.)</p>
              <p className="mb-4">Šie slapukai yra būtini svetainės saugumui ir funkcionalumui.</p>
              
              <h3 className="font-bold mb-3">Analitikos slapukai</h3>
              <p className="mb-2"><strong>Teisinis pagrindas:</strong> Sutikimas (BDAR 6 str. 1 d. a p.)</p>
              <p className="mb-4">Analitikos duomenis renkame tik gavę jūsų aiškų sutikimą.</p>
              
              <h3 className="font-bold mb-3">Rinkodaros slapukai</h3>
              <p className="mb-2"><strong>Teisinis pagrindas:</strong> Sutikimas (BDAR 6 str. 1 d. a p.)</p>
              <p>Rinkodaros slapukams reikalingas jūsų aiškus sutikimas, kurį galima bet kada atšaukti.</p>
            </div>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Duomenų saugojimo laikotarpis
            </h2>
            <ul className="mb-6 space-y-2">
              <li><strong>Sesijos slapukai:</strong> Ištrinami uždarant naršyklę</li>
              <li><strong>Pastovūs slapukai:</strong> Saugomi ne ilgiau kaip 2 metus</li>
              <li><strong>Sutikimo įrašai:</strong> Saugomi 3 metus teisinio atitikimo tikslais</li>
              <li><strong>Analitikos duomenys:</strong> Automatiškai ištrinami po 26 mėnesių</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Trečiųjų šalių paslaugos
            </h2>
            <div className="bg-white border border-sand-beige rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-3">Google Analytics</h3>
              <p className="mb-2">Naudojame Google Analytics su įjungtu IP adresų anonimiškumu.</p>
              <p className="mb-4">
                <strong>Duomenų valdytojas:</strong> Google LLC<br/>
                <strong>Privatumo politika:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sage-green hover:underline">https://policies.google.com/privacy</a><br/>
                <strong>Atsisakymas:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-sage-green hover:underline">Google Analytics atsisakymas</a>
              </p>
              
              <h3 className="font-bold mb-3">Firebase (Google)</h3>
              <p className="mb-2">Naudojama būtinoms svetainės funkcijoms ir rezervacijų sistemai.</p>
              <p>
                <strong>Teisinis pagrindas:</strong> Teisėtas interesas būtinoms funkcijoms<br/>
                <strong>Duomenų tvarkymo sutartis:</strong> Google Cloud duomenų tvarkymo sąlygos
              </p>
            </div>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Jūsų kontrolės galimybės
            </h2>
            <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6 mb-6">
              <ul className="space-y-3">
                <li>
                  <strong>Slapukų nustatymai:</strong> <Link href="/slapuku-nustatymai" className="text-sage-green hover:underline">Valdykite savo nustatymus</Link>
                </li>
                <li>
                  <strong>Naršyklės kontrolė:</strong> Galite išjungti slapukus naršyklės nustatymuose
                </li>
                <li>
                  <strong>Sutikimo atšaukimas:</strong> Susisiekite su mumis: privatumas@vespanida.lt
                </li>
                <li>
                  <strong>Duomenų subjekto prašymai:</strong> Prašykite prieigos, ištrynimo ar perkeliamimo
                </li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Kontaktai ir skundai
            </h2>
            <div className="bg-white border border-sand-beige rounded-lg p-6 mb-6">
              <p className="mb-4">
                <strong>Duomenų apsaugos pareigūnas:</strong><br/>
                El. paštas: info@vespanida.lt<br/>
                Telefonas: +370 679 56380
              </p>
              <p>
                <strong>Priežiūros institucija (Lietuva):</strong><br/>
                Valstybinė duomenų apsaugos inspekcija<br/>
                Svetainė: <a href="https://vdai.lrv.lt" target="_blank" rel="noopener noreferrer" className="text-sage-green hover:underline">https://vdai.lrv.lt</a>
              </p>
            </div>
            
            <h2 className="text-2xl font-bold text-graphite-black mb-4 font-syne">
              Šios politikos pakeitimai
            </h2>
            <p className="mb-6">
              Galime atnaujinti šią slapukų politiką, kad atspindėtume mūsų praktikos pokyčius arba 
              teisinio atitikimo tikslais. Apie reikšmingus pakeitimus pranešime parodydami aiškų 
              pranešimą mūsų svetainėje arba el. paštu, jei turime jūsų kontaktinę informaciją.
            </p>
            
            <div className="border-t border-sand-beige pt-6">
              <p className="text-sm text-graphite-black/60">
                Ši politika sukurta laikantis BDAR, el. privatumo direktyvos ir kitų taikomų duomenų apsaugos 
                įstatymų. Dėl šios politikos klausimų kreipkitės į mūsų duomenų apsaugos pareigūną.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
        <Footer />
    </main>
  );
}