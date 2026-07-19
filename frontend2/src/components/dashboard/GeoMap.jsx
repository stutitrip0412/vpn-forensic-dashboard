import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '../common/ui.jsx';

/**
 * FR8.2: geographic map plotting connection origins, with clustering for
 * high-volume cases. Clustering happens server-side (see
 * backend/controllers/statsController.js geoPoints aggregation — points
 * are grouped into ~11km grid cells by the database, not the browser),
 * so this component just renders whatever points it's given, sized by
 * their pre-aggregated count. No marker-cluster plugin needed, and no
 * dependency on Leaflet's default marker icon images (which break under
 * every bundler without manual asset-path config) — plain CircleMarkers
 * styled with the app's own palette instead.
 */

function radiusForCount(count, maxCount) {
  const min = 6;
  const max = 26;
  if (maxCount <= 1) return min;
  return min + (max - min) * Math.sqrt(count / maxCount);
}

export function GeoMap({ geoPoints }) {
  const points = (geoPoints || []).filter((p) => typeof p.lat === 'number' && typeof p.long === 'number');
  const maxCount = points.reduce((max, p) => Math.max(max, p.count), 1);

  const center = points.length > 0 ? [points[0].lat, points[0].long] : [20, 0];
  const zoom = points.length > 0 ? 3 : 2;

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-lo">Connection origins</p>
        <p className="mt-0.5 text-xs text-text-lo">
          GeoIP-derived and approximate — do not treat as ground truth. Points are clustered server-side by
          proximity.
        </p>
      </div>
      <div style={{ height: 360 }}>
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-text-lo">
            No geolocated connections for this case yet.
          </div>
        ) : (
          <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((p, i) => (
              <CircleMarker
                key={i}
                center={[p.lat, p.long]}
                radius={radiusForCount(p.count, maxCount)}
                pathOptions={{ color: '#4A90A4', fillColor: '#4A90A4', fillOpacity: 0.35, weight: 1.5 }}
              >
                <Popup>
                  <span className="font-mono text-xs">
                    {p.city ? `${p.city}, ` : ''}
                    {p.country || 'Unknown location'}
                    <br />
                    {p.count} event{p.count === 1 ? '' : 's'}
                  </span>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </Card>
  );
}
