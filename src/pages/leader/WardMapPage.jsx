import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, AlertCircle, Users, BarChart3, Map as MapIcon } from 'lucide-react';
import { DELHI_ZONES, ZONE_BY_ID } from '../../data/delhiData';

const GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/datameet/Municipal_Spatial_Data@master/Delhi/Delhi_Wards.geojson';
const BOUNDS = { minLng: 76.83, maxLng: 77.35, minLat: 28.40, maxLat: 28.89 };

// Professional Muted Palette
const getMutedColor = (score, alpha = 0.8) => {
  if (score >= 75) return `rgba(2, 248, 1, ${alpha})`; // Light Green (soft success)
  if (score >= 55) return `rgba(1, 150, 250, ${alpha})`; // Sky Blue (calm info)
  if (score >= 40) return `rgba( 248, 1, 1,${alpha})`; // Soft Amber (warning)
  return `rgba(255, 99, 132, ${alpha})`;                   // Soft Red (pleasant danger)
};
const project = (lng, lat, w, h) => {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * w;
  const y = h - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h;
  return [x, y];
};

export default function WardMap() {
  const [wards, setWards] = useState([]);
  const [hoveredWard, setHoveredWard] = useState(null);
  const [selectedZone, setSelectedZone] = useState(DELHI_ZONES[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(res => res.json())
      .then(data => {
        const processed = data.features.map(f => ({
          ...f, 
          _zoneId: f.properties?.zone_id || DELHI_ZONES[Math.floor(Math.random() * DELHI_ZONES.length)].id 
        }));
        setWards(processed);
      });
  }, []);

  const renderPath = (feature) => {
    const coords = feature.geometry.coordinates;
    const rings = feature.geometry.type === 'Polygon' ? [coords] : coords;
    return rings.map(ring => 
      ring[0].map((coord, i) => {
        const [x, y] = project(coord[0], coord[1], 850, 650);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ') + 'Z'
    ).join(' ');
  };

  return (
    <div style={{ display: 'flex', height: '92vh', gap: '24px', padding: '24px', background: 'var(--canvas)' }}>
      
      {/* MAP VIEWPORT */}
      <div style={{ flex: 3, position: 'relative' }} className="map-viewport" ref={mapRef}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
          <div className="glass-dark" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <Activity size={14} className="text-blue" />
            <span className="text-mono">SYSTEM_ACTIVE</span>
          </div>
        </div>

        <svg viewBox="0 0 850 650" width="100%" height="100%" onMouseMove={(e) => {
          const rect = mapRef.current.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}>
          {wards.map((ward, i) => {
            const zone = ZONE_BY_ID[ward._zoneId];
            const isHovered = hoveredWard === ward;
            const isSelected = selectedZone?.id === ward._zoneId;
            const color = getMutedColor(zone.healthScore, isHovered ? 1 : 0.65);
            
            return (
              <path
                key={i}
                d={renderPath(ward)}
                fill={color}
                stroke={isHovered ? "#fff" : "rgba(241, 234, 234, 0.93)"}
                strokeWidth={isHovered ? 1.8 : 0.4}
                style={{ transition: 'all 0.2s ease', cursor: 'pointer', filter: isHovered ? 'brightness(1.2)' : 'none' }}
                onMouseEnter={() => setHoveredWard(ward)}
                onMouseLeave={() => setHoveredWard(null)}
                onClick={() => setSelectedZone(zone)}
              />
            );
          })}
        </svg>

        {/* ENHANCED TOOLTIP */}
        {hoveredWard && (
          <div className="glass-dark animate-fade-in" style={{
            position: 'absolute', left: mousePos.x + 24, top: mousePos.y + 24,
            padding: '20px', borderRadius: '12px', pointerEvents: 'none', zIndex: 100, width: '280px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="text-mono" style={{ fontSize: '10px', opacity: 0.6 }}>UNIT: {ZONE_BY_ID[hoveredWard._zoneId].code}</span>
              <span style={{ fontSize: '10px', color: getMutedColor(ZONE_BY_ID[hoveredWard._zoneId].healthScore, 1), fontWeight: 'bold' }}>
                {ZONE_BY_ID[hoveredWard._zoneId].healthScore >= 60 ? 'STABLE' : 'CRITICAL'}
              </span>
            </div>

            <h3 className="text-display" style={{ fontSize: '1.4rem', margin: '0 0 4px 0' }}>{ZONE_BY_ID[hoveredWard._zoneId].name}</h3>
            <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px' }}>Top Issue: {ZONE_BY_ID[hoveredWard._zoneId].topIssue}</p>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{ZONE_BY_ID[hoveredWard._zoneId].pending}</div>
                <div style={{ fontSize: '9px', opacity: 0.5 }}>ALERTS</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '15px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{ZONE_BY_ID[hoveredWard._zoneId].healthScore}</div>
                <div style={{ fontSize: '9px', opacity: 0.5 }}>HEALTH</div>
              </div>
            </div>

            <div className="sentiment-bar">
              <div style={{ width: `${ZONE_BY_ID[hoveredWard._zoneId].sentimentBreakdown.angry}%`, background: '#9B2226' }} />
              <div style={{ width: `${ZONE_BY_ID[hoveredWard._zoneId].sentimentBreakdown.neutral}%`, background: '#5E60CE' }} />
              <div style={{ width: `${ZONE_BY_ID[hoveredWard._zoneId].sentimentBreakdown.satisfied}%`, background: '#344E41' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', opacity: 0.5 }}>
              <span>ANGRY</span>
              <span>SATISFIED</span>
            </div>
          </div>
        )}
      </div>

      {/* SIDEBAR FEED */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="text-display">Zone Intel</h2>
          <BarChart3 size={20} className="text-muted" />
        </div>
        
        {DELHI_ZONES.map(z => (
          <div 
            key={z.id} 
            className={`glass-panel zone-card ${selectedZone?.id === z.id ? 'zone-card-active' : ''}`}
            style={{ 
              padding: '16px', borderRadius: '12px', 
              borderLeft: `4px solid ${getMutedColor(z.healthScore, 1)}`
            }}
            onClick={() => setSelectedZone(z)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-display" style={{ fontSize: '1.1rem' }}>{z.shortName}</span>
              <span className="text-mono" style={{ color: getMutedColor(z.healthScore, 1), fontWeight: 'bold' }}>{z.healthScore}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '11px', color: 'var(--ink-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {z.totalWards} Wards</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {z.pending} Alerts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}