import { useState, useEffect, useCallback, useRef } from 'react';
import GlobeScene from './GlobeScene';
import './Globe.css';

const Globe = () => {
    const [temperatureData, setTemperatureData] = useState(null);
    const [year, setYear] = useState(2000);
    const [viewMode, setViewMode] = useState('absolute');
    const [isLoading, setIsLoading] = useState(true);
    const [tempRange, setTempRange] = useState({ min: 0, max: 0 });
    const [diffRange] = useState({ min: -2, max: 2 });
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef(null);

    const animate = useCallback(() => {
        setYear(prevYear => {
            const nextYear = prevYear + 1;
            if (nextYear > 2024) {
                return viewMode === 'absolute' ? 2000 : 2001;
            }
            return nextYear;
        });
        animationRef.current = requestAnimationFrame(animate);
    }, [viewMode]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, animate]);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setYear(mode === 'absolute' ? 2000 : 2001);
        setIsPlaying(false);
    };

    useEffect(() => {
        fetch('data/temperature_data.json')
            .then(response => response.json())
            .then(data => {
                setTemperatureData(data);
                setTempRange({
                    min: Math.floor(data.metadata.min_temperature),
                    max: Math.ceil(data.metadata.max_temperature)
                });
                setIsLoading(false);
            })
            .catch(error => setIsLoading(false));
    }, []);

    return (
        <div className="ecoscape-container">
            <div className="main-content">
                <div className="left-section">
                    <h1>ECOSCAPE</h1>
                    <p>
                        Explore global temperature trends<br />
                        through interactive visualization.<br />
                        Toggle between absolute values<br />
                        and temperature anomalies to gain<br />
                        insights into our warming planet.
                    </p>
                    
                    <div className="view-controls">
                        <button 
                            className={`view-button ${viewMode === 'absolute' ? 'active' : ''}`}
                            onClick={() => handleViewModeChange('absolute')}
                        >
                            <span className={`dot ${viewMode === 'absolute' ? 'active-blue' : 'inactive-white'}`} />
                            Absolute Temperature
                        </button>
                        <button 
                            className={`view-button ${viewMode === 'difference' ? 'active' : ''}`}
                            onClick={() => handleViewModeChange('difference')}
                        >
                            <span className={`dot ${viewMode === 'difference' ? 'active-blue' : 'inactive-white'}`} />
                            Temperature Difference
                        </button>

                        <div className="legend">
                            {viewMode === 'absolute' ? (
                                <div className="legend-container">
                                    <div className="legend-gradient absolute-gradient"></div>
                                    <div className="legend-labels">
                                        <span>{tempRange.min}°C</span>
                                        <span>0°C</span>
                                        <span>{tempRange.max}°C</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="legend-container">
                                    <div className="legend-gradient difference-gradient">
                                        <div style={{ backgroundColor: '#0000ff' }}></div>
                                        <div style={{ backgroundColor: '#ffffff' }}></div>
                                        <div style={{ backgroundColor: '#ff0000' }}></div>
                                    </div>
                                    <div className="legend-labels">
                                        <span>-2°C</span>
                                        <span>0°C</span>
                                        <span>+2°C</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="right-section">
                    <div className="globe-section">
                        {!isLoading && (
                            <GlobeScene 
                                year={year}
                                temperatureData={temperatureData}
                                viewMode={viewMode}
                            />
                        )}
                    </div>
                    <div className="timeline-container">
                        <button 
                            className="play-button"
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <rect x="6" y="4" width="4" height="16" fill="white"/>
                                    <rect x="14" y="4" width="4" height="16" fill="white"/>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" fill="white"/>
                                </svg>
                            )}
                        </button>
                        <div className="slider-section">
                            <input 
                                type="range"
                                className="timeline-slider"
                                min="2000"
                                max="2024"
                                value={year}
                                onChange={(e) => {
                                    const newYear = parseInt(e.target.value);
                                    setYear(newYear);
                                    setIsPlaying(false);
                                }}
                            />
                            <div className="year-display">{year}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Globe; 