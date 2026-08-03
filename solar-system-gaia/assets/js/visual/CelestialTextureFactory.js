import * as THREE from 'three';
import { registerCelestialSurface } from './CelestialVisualRegistry.js';

function seededRandom(seedText) {
    let seed = [...seedText].reduce((value, character) => Math.imul(value ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
    return () => {
        seed += 0x6D2B79F5;
        let value = seed;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

function createCelestialTexture(name, fallbackColor, renderer) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const random = seededRandom(name);
    const fill = (color) => { context.fillStyle = color; context.fillRect(0, 0, canvas.width, canvas.height); };
    const noise = (colors, count, maxRadius = 14) => {
        for (let index = 0; index < count; index++) {
            context.globalAlpha = .12 + random() * .3;
            context.fillStyle = colors[Math.floor(random() * colors.length)];
            context.beginPath();
            context.ellipse(random() * 512, random() * 256, 2 + random() * maxRadius, 1 + random() * maxRadius * .45, random() * Math.PI, 0, Math.PI * 2);
            context.fill();
        }
        context.globalAlpha = 1;
    };
    const bands = (colors, minHeight = 10, maxHeight = 28) => {
        let y = 0;
        let index = 0;
        while (y < 256) {
            const height = minHeight + random() * (maxHeight - minHeight);
            context.fillStyle = colors[index++ % colors.length];
            context.fillRect(0, y, 512, height + 1);
            y += height;
        }
        noise(colors, 90, 28);
    };
    const craters = (base, dark, light, count) => {
        fill(base);
        noise([dark, light], 180, 10);
        for (let index = 0; index < count; index++) {
            const x = random() * 512, y = random() * 256, radius = 2 + random() * 12;
            context.fillStyle = dark; context.globalAlpha = .42;
            context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
            context.strokeStyle = light; context.globalAlpha = .45; context.lineWidth = Math.max(1, radius * .18);
            context.beginPath(); context.arc(x - radius * .12, y - radius * .12, radius * .82, Math.PI, Math.PI * 1.85); context.stroke();
        }
        context.globalAlpha = 1;
    };

    if (name === 'Sol') {
        bands(['#ff9d16', '#ffc23d', '#f47a12'], 5, 13); noise(['#fff0a1', '#d9550b'], 650, 5);
    } else if (name === 'Mercúrio') {
        craters('#777873', '#3c3e3c', '#b8b7ad', 80);
    } else if (name === 'Vênus') {
        bands(['#d99b42', '#f0c46f', '#b9792e', '#e5ae55'], 8, 19); noise(['#fff0aa', '#7d4b1f'], 140, 35);
    } else if (name === 'Terra') {
        fill('#1766a8');
        const continents = [['#4f883f',[[30,70],[105,48],[145,72],[126,120],[72,136],[42,112]]],['#619447',[[205,38],[284,46],[318,83],[292,112],[244,105],[222,70]]],['#477d37',[[325,120],[390,100],[445,122],[430,166],[370,184],[338,158]]],['#9c8e55',[[120,150],[178,132],[207,170],[173,219],[111,202]]]];
        continents.forEach(([color, points]) => { context.fillStyle = color; context.beginPath(); points.forEach(([x,y],i)=>i?context.lineTo(x,y):context.moveTo(x,y)); context.closePath(); context.fill(); });
        context.fillStyle = 'rgba(255,255,255,.72)'; context.fillRect(0,0,512,12); context.fillRect(0,244,512,12);
        noise(['#76b85c','#d3bd77'],100,10); context.globalAlpha=.25; noise(['#ffffff'],95,32); context.globalAlpha=1;
    } else if (name === 'Marte') {
        fill('#a8492f'); noise(['#d7794c','#632d28','#e09a63'],260,18);
        context.fillStyle='rgba(238,222,202,.85)'; context.fillRect(0,0,512,10); context.fillRect(0,246,512,10);
    } else if (name === 'Júpiter') {
        bands(['#d6b28c','#9f694b','#f0dbc0','#bd805f','#ead1aa'],7,19);
        context.fillStyle='#a8422f'; context.globalAlpha=.85; context.beginPath(); context.ellipse(370,170,43,19,-.08,0,Math.PI*2); context.fill(); context.globalAlpha=1;
    } else if (name === 'Saturno') {
        bands(['#e2d09d','#bfae7f','#f0e2b4','#c9b98b'],7,16);
    } else if (name === 'Urano') {
        const gradient=context.createLinearGradient(0,0,0,256); gradient.addColorStop(0,'#a9f0ee'); gradient.addColorStop(.5,'#67cfd2'); gradient.addColorStop(1,'#91e2e1'); context.fillStyle=gradient; context.fillRect(0,0,512,256); noise(['#d9ffff','#3aaeb6'],45,38);
    } else if (name === 'Netuno') {
        bands(['#2651b7','#376ed2','#173d9c','#4d83df'],12,27); context.fillStyle='#132c76'; context.beginPath(); context.ellipse(350,145,32,13,0,0,Math.PI*2); context.fill();
    } else if (name === 'Io') {
        fill('#d7bd54'); noise(['#f4e391','#a54b20','#5a3618'],260,12);
    } else if (name === 'Europa' || name === 'Encélado') {
        fill(name === 'Europa' ? '#ded7bf' : '#e8f3f5'); noise(['#9a765b','#a9c8d2','#ffffff'],160,8);
        context.strokeStyle=name === 'Europa'?'rgba(112,67,52,.55)':'rgba(88,143,162,.4)'; context.lineWidth=2;
        for(let i=0;i<18;i++){context.beginPath();context.moveTo(0,random()*256);for(let x=0;x<=512;x+=32)context.lineTo(x,random()*16+((i*29+x*.13)%256));context.stroke();}
    } else if (name === 'Titã') {
        bands(['#c9893f','#e2af63','#9d622f'],13,31); noise(['#f2c87e'],90,34);
    } else {
        const base = `#${new THREE.Color(fallbackColor).getHexString()}`;
        craters(base, '#34363a', '#d5d0c4', 45);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    registerCelestialSurface(name, canvas);
    return texture;
}

export function createSafeCelestialTexture(name, fallbackColor, renderer) {
    try {
        return createCelestialTexture(name, fallbackColor, renderer);
    } catch (error) {
        console.warn(`Textura procedural de ${name} desativada; usando material básico.`, error);
        return null;
    }
}

