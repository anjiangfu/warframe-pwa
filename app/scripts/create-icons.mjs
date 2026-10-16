// Original geometric star, no game artwork or downloaded assets.
import {writeFileSync,mkdirSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
function crc(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type);const out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);name.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([name,data])),out.length-4);return out;}
mkdirSync('public/icons',{recursive:true});
for(const size of [192,512]){const raw=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const dx=Math.abs(x-size/2)/size,dy=Math.abs(y-size/2)/size;const star=dx+dy<.26&&Math.min(dx,dy)<.035+Math.max(0,.15-Math.max(dx,dy))*.35;const ring=Math.abs(Math.hypot(dx,dy)-.34)<.008;const color=star?[141,227,218]:ring?[58,118,137]:[10,25,42];const i=y*(size*4+1)+1+x*4;raw[i]=color[0];raw[i+1]=color[1];raw[i+2]=color[2];raw[i+3]=255;}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;writeFileSync(`public/icons/icon-${size}.png`,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));}
