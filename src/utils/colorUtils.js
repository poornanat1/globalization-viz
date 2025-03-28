import * as THREE from 'three';

export const getTemperatureColor = (temperature) => {
    const sigmoid = (x) => 1 / (1 + Math.exp(-x * 2.5));
    
    let r, g, b;

    if (temperature < 0) {
        const t = sigmoid((temperature + 20) / 20);
        r = t * 0.5;
        g = t * 0.5;
        b = 1;
    } else if (temperature < 20) {
        const t = temperature / 20;
        r = sigmoid(t * 4);
        g = sigmoid(t * 4);
        b = 1 - sigmoid(t * 3);
    } else {
        const t = (temperature - 20) / 20;
        r = 1;
        g = 1 - sigmoid(t * 2);
        b = 0;
    }

    if (temperature > 0 && temperature < 20) {
        g *= 0.9;
    }

    return new THREE.Color(r, g, b);
};

export const getDifferenceColor = (diff, minDiff, maxDiff) => {
    const maxAbsDiff = Math.max(Math.abs(minDiff), Math.abs(maxDiff));
    let normalizedDiff = diff / maxAbsDiff;
    
    normalizedDiff = Math.sign(normalizedDiff) * Math.pow(Math.abs(normalizedDiff), 0.5);
    const threshold = 0.02;

    if (Math.abs(normalizedDiff) < threshold) {
        return new THREE.Color(1, 1, 0.9);
    } else if (normalizedDiff < 0) {
        const t = (-normalizedDiff - threshold) / (1 - threshold);
        const intensity = Math.pow(t, 0.7);
        return new THREE.Color(
            0.2 + (1 - intensity) * 0.8,
            0.2 + (1 - intensity) * 0.8,
            1
        );
    } else {
        const t = (normalizedDiff - threshold) / (1 - threshold);
        const intensity = Math.pow(t, 0.7);
        return new THREE.Color(
            1,
            0.2 + (1 - intensity) * 0.3,
            0.2 + (1 - intensity) * 0.2
        );
    }
}; 