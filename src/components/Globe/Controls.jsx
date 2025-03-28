import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setYear, setViewMode } from '../../store/slices/globeSlice';

const Controls = () => {
  const dispatch = useDispatch();
  const { year, viewMode } = useSelector(state => state.globe);

  return (
    <div className="controls">
      <div className="view-controls">
        <button 
          className={`control-button ${viewMode === 'absolute' ? 'active' : ''}`}
          onClick={() => dispatch(setViewMode('absolute'))}
        >
          Absolute Temperature
        </button>
        <button 
          className={`control-button ${viewMode === 'difference' ? 'active' : ''}`}
          onClick={() => dispatch(setViewMode('difference'))}
        >
          Temperature Difference
        </button>
      </div>
      
      <div className="timeline">
        <input 
          type="range"
          min="1880"
          max="2024"
          value={year}
          className="timeline-slider"
          onChange={(e) => dispatch(setYear(parseInt(e.target.value)))}
        />
        <span className="year">{year}</span>
      </div>
    </div>
  );
};

export default Controls; 