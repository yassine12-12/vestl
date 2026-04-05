import React from 'react';
import { DataState, DeparturesData, Departure } from '../types';
import { Theme } from '../themes';

interface DeparturesCardProps {
  departuresState: DataState<DeparturesData>;
  theme: Theme;
  hiddenModes?: string[];
}

const formatTime = (when: string): string => {
  const date = new Date(when);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return 'Now';
  if (diffMins === 1) return '1 min';
  return `${diffMins} min`;
};

const getModeIcon = (mode: string): string => {
  const icons: Record<string, string> = {
    'subway': 'U',
    'suburban': 'S',
    'tram': 'T',
    'bus': 'B',
  };
  return icons[mode] || 'T';
};

const getModeName = (mode: string): string => {
  const names: Record<string, string> = {
    'subway': 'U-Bahn',
    'suburban': 'S-Bahn',
    'tram': 'Tram',
    'bus': 'Bus',
  };
  return names[mode] || mode;
};

interface GroupedDeparture {
  mode: string;
  departures: Departure[];
  lines: string[];
}

export const DeparturesCard: React.FC<DeparturesCardProps> = ({ departuresState, theme, hiddenModes = [] }) => {
  const { data, status } = departuresState;

  // Group departures by mode and get next 2 for each
  const groupByMode = (departures: Departure[]): GroupedDeparture[] => {
    const modeMap = new Map<string, Departure[]>();
    
    departures.forEach(dep => {
      const mode = dep.line.mode;
      if (!modeMap.has(mode)) {
        modeMap.set(mode, []);
      }
      modeMap.get(mode)!.push(dep);
    });

    const grouped: GroupedDeparture[] = [];
    modeMap.forEach((deps, mode) => {
      const sortedDeps = deps.sort((a, b) => 
        new Date(a.when).getTime() - new Date(b.when).getTime()
      );
      
      const nextTwo = sortedDeps.slice(0, 2);
      const uniqueLines = [...new Set(deps.map(d => d.line.name))];
      
      grouped.push({
        mode,
        departures: nextTwo,
        lines: uniqueLines.slice(0, 5)
      });
    });

    // Order: subway, suburban, tram, bus
    const order = ['subway', 'suburban', 'tram', 'bus'];
    return grouped.sort((a, b) => 
      order.indexOf(a.mode) - order.indexOf(b.mode)
    );
  };

  return (
    <div>
      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-lg"></div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div 
          className="text-[10px]"
          style={{ color: theme.textSecondary }}
        >
          Transport unavailable
        </div>
      )}

      {status === 'success' && data && (
        <>
          {data.departures.length === 0 ? (
            <div 
              className="text-[10px]"
              style={{ color: theme.textSecondary }}
            >
              No departures
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {groupByMode(data.departures).filter(g => !hiddenModes.includes(g.mode)).map((group, index) => (
                <div key={`${group.mode}-${index}`}>
                  {/* Mode Header */}
                  <div className="flex items-center space-x-2.5 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: theme.accentColor,
                      }}
                    >
                      <span 
                        className="text-[16px] font-black"
                        style={{ color: theme.background }}
                      >
                        {getModeIcon(group.mode)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span 
                        className="text-[18px] font-black block leading-none"
                        style={{ color: theme.textColor }}
                      >
                        {getModeName(group.mode)}
                      </span>
                      <div 
                        className="text-[11px] font-medium truncate mt-0.5 opacity-60"
                        style={{ color: theme.textSecondary }}
                      >
                        {group.lines.slice(0, 4).join(' · ')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Departures - Side by Side - Minimal Design */}
                  <div className="grid grid-cols-2 gap-3">
                    {group.departures.map((dep, idx) => (
                      <div 
                        key={`${dep.tripId}-${idx}`}
                        className="flex items-center justify-between py-2.5"
                        style={{ 
                          borderLeft: `3px solid ${theme.accentColor}`,
                          paddingLeft: '0.75rem'
                        }}
                      >
                        <div className="flex flex-col flex-1 min-w-0">
                          <div 
                            className="font-black text-[24px] mb-1 leading-none"
                            style={{ color: theme.textColor }}
                          >
                            {dep.line.name}
                          </div>
                          <div 
                            className="text-[13px] font-medium truncate opacity-70"
                            style={{ color: theme.textColor }}
                          >
                            {dep.direction}
                          </div>
                        </div>
                        <div 
                          className="text-[32px] font-black leading-none ml-3"
                          style={{ color: theme.accentColor }}
                        >
                          {formatTime(dep.when)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {status === 'idle' && (
        <div 
          className="text-[10px]"
          style={{ color: theme.textSecondary }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};
