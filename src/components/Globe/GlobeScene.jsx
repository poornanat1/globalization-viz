import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect, useRef } from 'react';
import { createTemperatureTexture, createDifferenceTexture } from '../../utils/textureUtils';

const GlobeScene = ({ year, temperatureData, viewMode }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const globeRef = useRef(null);
    const temperatureLayerRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const updateSize = () => {
            const container = mountRef.current;
            const isMobile = window.innerWidth <= 768;
            const size = isMobile 
                ? Math.min(350, window.innerWidth - 32) // Account for padding
                : Math.min(container.clientWidth, container.clientHeight);
            
            camera.aspect = 1;
            camera.updateProjectionMatrix();
            renderer.setSize(size, size);

            // Adjust camera position for mobile
            camera.position.z = isMobile ? 250 : 300;
        };

        // Initial setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        updateSize();
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(1, 1, 1);
        scene.add(mainLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(-1, -1, -1);
        scene.add(backLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;

        const geometry = new THREE.SphereGeometry(85, 128, 128);
        const textureLoader = new THREE.TextureLoader();

        Promise.all([
            textureLoader.loadAsync('https://unpkg.com/three-globe/example/img/earth-dark.jpg'),
            textureLoader.loadAsync('https://unpkg.com/three-globe/example/img/earth-topology.png')
        ]).then(([earthTexture, bumpTexture]) => {
            earthTexture.wrapS = earthTexture.wrapT = THREE.RepeatWrapping;
            bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;

            const material = new THREE.MeshPhongMaterial({
                map: earthTexture,
                bumpMap: bumpTexture,
                bumpScale: 5.0,
                shininess: 15,
                specular: new THREE.Color(0x333333)
            });

            const globe = new THREE.Mesh(geometry, material);
            scene.add(globe);
            globeRef.current = globe;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        sceneRef.current = scene;

        // Add resize handler
        window.addEventListener('resize', updateSize);
        window.addEventListener('orientationchange', updateSize);

        return () => {
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('orientationchange', updateSize);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!temperatureData || !sceneRef.current) return;

        if (temperatureLayerRef.current) {
            sceneRef.current.remove(temperatureLayerRef.current);
            temperatureLayerRef.current.geometry.dispose();
            temperatureLayerRef.current.material.dispose();
            temperatureLayerRef.current = null;
        }

        const geometry = new THREE.SphereGeometry(86, 128, 128);
        let texture;

        if (viewMode === 'absolute') {
            texture = createTemperatureTexture(
                temperatureData.data[year],
                temperatureData.metadata
            );
        } else {
            const previousYear = year - 1;
            if (temperatureData.data[previousYear]) {
                texture = createDifferenceTexture(
                    temperatureData.data[year],
                    temperatureData.data[previousYear],
                    temperatureData.metadata
                );
            }
        }

        if (texture) {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity: viewMode === 'absolute' ? 0.8 : 0.9
            });

            const temperatureLayer = new THREE.Mesh(geometry, material);
            sceneRef.current.add(temperatureLayer);
            temperatureLayerRef.current = temperatureLayer;
        }
    }, [year, temperatureData, viewMode]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default GlobeScene; 