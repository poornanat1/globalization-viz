import * as THREE from 'three';
import { getTemperatureColor, getDifferenceColor } from './colorUtils';

export const createTemperatureTexture = (yearData, metadata) => {
    if (!yearData || !metadata) return null;

    const { min_temperature, max_temperature, lat_bins, lon_bins } = metadata;
    const textureSize = 1024;
    const data = new Uint8Array(textureSize * textureSize * 4);

    for (let y = 0; y < textureSize; y++) {
        for (let x = 0; x < textureSize; x++) {
            const latIndex = Math.floor((y / textureSize) * lat_bins);
            const lonIndex = Math.floor((x / textureSize) * lon_bins);
            
            const pixelIndex = (y * textureSize + x) * 4;
            
            data[pixelIndex] = 0;
            data[pixelIndex + 1] = 0;
            data[pixelIndex + 2] = 0;
            data[pixelIndex + 3] = 0;

            if (latIndex < yearData.length && lonIndex < yearData[latIndex].length) {
                const normalizedValue = yearData[latIndex][lonIndex];
                if (normalizedValue !== null && !isNaN(normalizedValue)) {
                    const temperature = normalizedValue * (max_temperature - min_temperature) + min_temperature;
                    const color = getTemperatureColor(temperature);
                    
                    data[pixelIndex] = Math.floor(color.r * 255);
                    data[pixelIndex + 1] = Math.floor(color.g * 255);
                    data[pixelIndex + 2] = Math.floor(color.b * 255);
                    data[pixelIndex + 3] = 200;
                }
            }
        }
    }

    const texture = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
};

export const createDifferenceTexture = (currentYearData, previousYearData, metadata) => {
    if (!currentYearData || !previousYearData || !metadata) return null;

    const { min_temperature, max_temperature, lat_bins, lon_bins } = metadata;
    const textureSize = 1024;
    const data = new Uint8Array(textureSize * textureSize * 4);

    const differences = [];
    let maxDiff = -Infinity;
    let minDiff = Infinity;

    for (let y = 0; y < lat_bins; y++) {
        differences[y] = [];
        for (let x = 0; x < lon_bins; x++) {
            if (currentYearData[y] && previousYearData[y]) {
                const currentTemp = currentYearData[y][x] * (max_temperature - min_temperature) + min_temperature;
                const previousTemp = previousYearData[y][x] * (max_temperature - min_temperature) + min_temperature;
                const diff = currentTemp - previousTemp;
                differences[y][x] = diff;
                if (!isNaN(diff)) {
                    maxDiff = Math.max(maxDiff, diff);
                    minDiff = Math.min(minDiff, diff);
                }
            }
        }
    }

    for (let y = 0; y < textureSize; y++) {
        for (let x = 0; x < textureSize; x++) {
            const latIndex = Math.floor((y / textureSize) * lat_bins);
            const lonIndex = Math.floor((x / textureSize) * lon_bins);
            
            const pixelIndex = (y * textureSize + x) * 4;
            
            data[pixelIndex] = 0;
            data[pixelIndex + 1] = 0;
            data[pixelIndex + 2] = 0;
            data[pixelIndex + 3] = 0;

            if (differences[latIndex] && differences[latIndex][lonIndex] !== undefined) {
                const diff = differences[latIndex][lonIndex];
                if (!isNaN(diff)) {
                    const color = getDifferenceColor(diff, minDiff, maxDiff);
                    
                    data[pixelIndex] = Math.floor(color.r * 255);
                    data[pixelIndex + 1] = Math.floor(color.g * 255);
                    data[pixelIndex + 2] = Math.floor(color.b * 255);
                    data[pixelIndex + 3] = 230;
                }
            }
        }
    }

    const texture = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
}; 