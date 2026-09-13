import { useEffect, useMemo, useState } from 'react';
import { Check, Circle, FileText, MapPin, Navigation, Route } from 'lucide-react';
import { useApp } from '../context';
import { Badge, Btn, Card, SectionHeader } from '../components/ui';
import Nav from '../components/Nav';
import WorkflowProgress from '../components/WorkflowProgress';

const stages = ['Prepared', 'Loaded', 'Dispatched', 'In Transit', 'Arrived', 'Quality Check', 'Delivered'];
const cityCoords: Record<string, [number, number]> = {
  Jamnagar: [70.07, 22.47],
  Rajkot: [70.80, 22.30],
  Mundra: [69.72, 22.84],
  Ahmedabad: [72.57, 23.02],
  Gandhinagar: [72.63, 23.22],
  Vadodara: [73.18, 22.31],
  Bhavnagar: [72.15, 21.76],
  Surat: [72.83, 21.17],
  Mumbai: [72.88, 19.08],
};
const routeOptions = ['Ahmedabad → Vadodara → Mumbai', 'Ahmedabad → Mumbai', 'Surat → Mumbai', 'Jamnagar → Ahmedabad', 'Vadodara → Mumbai'];
const routeMeta: Record<string, { distance: string; eta: string; stops: string[] }> = {
  'Ahmedabad → Vadodara → Mumbai': { distance: '520 km', eta: '14–18 h', stops: ['Ahmedabad', 'Vadodara', 'Mumbai'] },
  'Ahmedabad → Mumbai': { distance: '530 km', eta: '15–19 h', stops: ['Ahmedabad', 'Mumbai'] },
  'Surat → Mumbai': { distance: '285 km', eta: '7–9 h', stops: ['Surat', 'Mumbai'] },
  'Jamnagar → Ahmedabad': { distance: '315 km', eta: '8–10 h', stops: ['Jamnagar', 'Ahmedabad'] },
  'Vadodara → Mumbai': { distance: '415 km', eta: '11–14 h', stops: ['Vadodara', 'Mumbai'] },
};
const events = [['13 Sep · 08:00', 'Prepared', 'Kutch Capture & Conditioning Unit, Mundra, Gujarat'], ['13 Sep · 11:20', 'Loaded', 'Tank TK-IN-2401 · Mundra, Gujarat'], ['13 Sep · 14:10', 'Dispatched', 'NH 48 corridor · Gujarat'], ['14 Sep · 09:30', 'In Transit', 'Ahmedabad → Vadodara → Mumbai (demo route)'], ['15 Sep (est.)', 'Arrived', 'Maharashtra Concrete Systems, Mumbai'], ['15 Sep (est.)', 'Quality Check', 'Buyer facility laboratory'], ['15 Sep (est.)', 'Delivered', 'Receipt confirmation pending']];

type GeoJson = { type: string; coordinates: any };
const VIEW = { width: 700, height: 440, minLon: 68.0, maxLon: 74.8, minLat: 19.9, maxLat: 24.8 };
function project([lon, lat]: [number, number]): [number, number] { return [((lon - VIEW.minLon) / (VIEW.maxLon - VIEW.minLon)) * VIEW.width, ((VIEW.maxLat - lat) / (VIEW.maxLat - VIEW.minLat)) * VIEW.height]; }
function ringPath(ring: [number, number][]) { return `${ring.map((point, i) => `${i ? 'L' : 'M'}${project(point)[0].toFixed(1)} ${project(point)[1].toFixed(1)}`).join(' ')} Z`; }
function geometryPaths(geometry: GeoJson | null) { if (!geometry) return []; if (geometry.type === 'Polygon') return geometry.coordinates.map((ring: [number, number][]) => ringPath(ring)); if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap((polygon: [number, number][][]) => polygon.map(ring => ringPath(ring))); return []; }

function downloadReport() { const text = `Carbon-Connect Order Summary\nDemo / illustrative data — not a live shipment\n\nOrder: CC-O-2401\nCO2 quantity: 500 t\nPurity: 99.51%\nSupplier: Kutch Industrial Materials Pvt. Ltd.\nBuyer: Maharashtra Concrete Systems (demo)\nRoute: Mundra → Ahmedabad → Vadodara → Mumbai\nDelivered price estimate: ₹5,900/t\nTransport cost estimate: ₹1,050/t\nTransport emissions estimate: 18.4 tCO2e\nDelivery: Estimated 15 Sep 2026\nQuality verification: Pending\nImpact: To be measured and reported after utilization\n`; const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); const a = document.createElement('a'); a.href = url; a.download = 'carbon-connect-order-summary-CC-O-2401.txt'; a.click(); URL.revokeObjectURL(url); }

export default function Logistics() {
  const { navigate } = useApp();
  const [route, setRoute] = useState(routeOptions[0]);
  const [boundary, setBoundary] = useState<GeoJson | null>(null);
  useEffect(() => { fetch('/gujarat.geojson').then(response => response.json()).then(data => setBoundary(data.features?.[0]?.geometry ?? data.geometry ?? null)).catch(() => setBoundary(null)); }, []);
  const meta = routeMeta[route];
  const cityPoints = useMemo(() => Object.entries(cityCoords).map(([name, coords]) => ({ name, point: project(coords), routeIndex: meta.stops.indexOf(name) })), [meta]);
  const routePoints = meta.stops.map(name => project(cityCoords[name]));
  const routePath = routePoints.map((point, i) => `${i ? 'L' : 'M'}${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(' ');
  const boundaryPaths = geometryPaths(boundary);

  return <div className="min-h-screen bg-[#F4F7F2]"><Nav/><main className="page-shell max-w-screen-xl mx-auto px-6 py-8">
    <WorkflowProgress current="logistics"/>
    <SectionHeader title="Logistics & route" sub="Order CC-O-2401 · demo shipment from Gujarat to Maharashtra" action={<div className="flex flex-wrap gap-2"><Btn variant="outline" onClick={downloadReport}>Download report</Btn><Btn onClick={() => navigate('digital-passport')}>CO₂ passport →</Btn></div>}/>
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-7 flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0"/><div><div className="text-sm font-semibold text-blue-900">In Transit · illustrative route</div><div className="text-sm text-blue-700 mt-0.5">500 t liquid CO₂ · ETA 15 Sep 2026 · Demo data, not a live shipment</div></div></div>
    <div className="grid lg:grid-cols-[1.45fr_.75fr] gap-7 items-start"><div className="space-y-7">
      <Card className="p-6"><div className="flex flex-wrap justify-between items-start gap-4 mb-5"><div><h3 className="text-base font-semibold">Gujarat route map</h3><p className="text-sm text-[#607267] mt-1">State boundary and major city reference points. Route line is illustrative, not turn-by-turn navigation.</p></div><label className="flex items-center gap-2 text-sm text-[#415547]"><Route size={16} className="text-[#2F6B4F]"/><select value={route} onChange={e => setRoute(e.target.value)} className="min-h-10 border border-slate-600 rounded-lg px-3 py-2 bg-[#FFFFFF] text-[#1F2B23]"><option>{routeOptions[0]}</option><option>{routeOptions[1]}</option><option>{routeOptions[2]}</option><option>{routeOptions[3]}</option><option>{routeOptions[4]}</option></select></label></div>
        <div className="relative rounded-xl border border-slate-700/70 overflow-hidden bg-[#e8f0e9] h-[420px]"><svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="w-full h-full" role="img" aria-label={`Gujarat map showing route ${route}`}><defs><pattern id="map-grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="#b8c9bf" strokeWidth=".6" opacity=".55"/></pattern></defs><rect width="700" height="440" fill="url(#map-grid)"/>{boundaryPaths.length ? <g><path d={boundaryPaths.join(' ')} fill="#cfe2d5" stroke="#547b67" strokeWidth="2.4"/><path d={boundaryPaths.join(' ')} fill="none" stroke="#eff8f1" strokeWidth="7" opacity=".7"/></g> : <path d="M125 25 C215 4 344 15 430 52 C515 90 563 164 515 225 C478 270 398 292 345 340 L232 327 C203 286 163 264 131 224 C96 181 76 131 92 83 C99 56 109 38 125 25Z" fill="#cfe2d5" stroke="#547b67" strokeWidth="2.4"/>}<path d={routePath} fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity=".85"/><path d={routePath} fill="none" stroke="#147ca5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="11 8"/>{cityPoints.map(({ name, point, routeIndex }) => <g key={name}><circle cx={point[0]} cy={point[1]} r={routeIndex >= 0 ? 8 : 5} fill={routeIndex === 0 ? '#155f7e' : routeIndex === 1 ? '#2F6B4F' : routeIndex > 1 ? '#7f978b' : '#637d70'} stroke="white" strokeWidth="2.5"/><text x={point[0] + 11} y={point[1] + 4} fontSize={routeIndex >= 0 ? '14' : '11'} fontWeight={routeIndex >= 0 ? '700' : '500'} fill="#19382b">{name}</text></g>)}<g><circle cx="626" cy="388" r="7" fill="#2F6B4F" stroke="white" strokeWidth="2"/><text x="640" y="393" fontSize="12" fontWeight="700" fill="#19382b">Mumbai</text><path d={`M${project(cityCoords.Mumbai)[0]} ${project(cityCoords.Mumbai)[1]} L626 388`} stroke="#147ca5" strokeWidth="2" strokeDasharray="5 5" opacity=".65"/></g><text x="24" y="28" fontSize="14" fontWeight="700" fill="#315744">GUJARAT · INDIA</text><text x="24" y="48" fontSize="11" fill="#496b5a">Reference map for logistics planning</text></svg><div className="absolute bottom-4 left-4 bg-[#FFFFFF]/95 rounded-lg border border-slate-700/70 px-4 py-3 text-sm text-[#314237]"><span className="font-semibold">{route}</span><br/>Road distance estimate: {meta.distance} · ETA: {meta.eta}<br/><span className="text-[#607267]">Transport: ₹1,050/t · emissions estimate: 18.4 tCO₂e</span></div><div className="absolute top-4 right-4 rounded-lg border border-slate-300/80 bg-white/90 px-3 py-2 text-xs text-[#819488]">Schematic route · not live GPS</div></div></Card>
      <Card className="p-6"><h3 className="text-base font-semibold mb-5">Shipment status</h3><div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">{stages.map((stage, i) => <div key={stage} className="text-center"><div className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm ${i < 3 ? 'bg-[#2F6B4F] text-white' : i === 3 ? 'bg-blue-500 text-white animate-pulse' : 'bg-[#FFFFFF] border border-slate-600 text-[#718276]'}`}>{i < 3 ? <Check size={16}/> : i + 1}</div><div className="text-xs text-[#607267] mt-2 leading-tight">{stage}</div></div>)}</div></Card>
      <Card className="p-6"><h3 className="text-base font-semibold mb-5">Shipment timeline</h3><div className="space-y-5">{events.map(([time, title, location], i) => <div key={title} className="flex gap-4"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${i < 3 ? 'bg-[#2F6B4F] text-white' : i === 3 ? 'bg-blue-500 text-white' : 'border border-slate-600 text-[#718276]'}`}>{i < 3 ? <Check size={13}/> : i === 3 ? <Circle size={9} fill="currentColor"/> : <Circle size={9}/>}</div><div><div className="text-sm font-medium">{title}{i === 3 && <Badge variant="blue" className="ml-2">CURRENT</Badge>}</div><div className="text-sm text-[#718276] mt-0.5">{time} · {location}</div></div></div>)}</div></Card>
    </div><div className="space-y-5"><Card className="p-6"><h3 className="text-sm font-semibold text-[#415547] uppercase tracking-widest mb-4">Shipment details</h3>{[['Batch ID', 'CC-IN-2401'], ['Quantity', '500 t'], ['Purity', '99.51%'], ['Physical state', 'Liquid'], ['Tank ID', 'TK-IN-2401'], ['Carrier', 'Demo carrier · pending confirmation'], ['Transport emissions', 'Estimated · 18.4 tCO₂e']].map(([k, v]) => <div key={k} className="flex justify-between gap-4 text-sm border-b border-slate-800 py-3"><span className="text-[#607267]">{k}</span><span className="font-mono text-right">{v}</span></div>)}</Card><Card className="p-6"><h3 className="text-sm font-semibold text-[#415547] uppercase tracking-widest mb-4">Documents</h3><div className="space-y-3 text-sm">{['Bill of lading · demo', 'Certificate of Analysis', 'Delivery note · pending', 'CO₂ Digital Passport'].map((x, i) => <div key={x} className="flex justify-between gap-3"><span className="inline-flex items-center gap-2"><FileText size={15}/>{x}</span><span className={i < 2 ? 'text-[#2F6B4F]' : 'text-[#718276]'}>{i < 2 ? 'Available' : 'Pending'}</span></div>)}</div></Card><Card className="p-5 border-[#9FB7A3]/70 bg-sky-950/20"><div className="flex gap-3"><MapPin size={18} className="text-[#2F6B4F] shrink-0"/><div><div className="text-sm font-semibold">Route planning note</div><p className="text-sm text-[#607267] mt-1 leading-relaxed">Distances and ETAs are illustrative estimates. Confirm carrier, road conditions, permits, storage and receiving requirements before dispatch.</p></div></div></Card><Btn className="w-full" onClick={() => navigate('quality-verification')}>Quality check on arrival →</Btn></div></div>
  </main></div>;
}
