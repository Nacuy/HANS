"""Dependency-free GLB fallback exporter for HAN indoor guide maps.
Nodes carry room code/name in extras for website hover/click UI.
"""
import json, struct
from pathlib import Path

OUT = Path('/Users/yucan/Repositories/HANS')

# room: code, label, x, y, width, depth, color-key
LEVEL_1 = [
 ('B0.16','FabLab',-12,9.1,7.1,6,'purple'),('B0.17','',-13.2,13,5,2.5,'purple'),('B0.18','',-7.5,12.8,3.1,2.8,'purple'),
 ('B0.14','Houtwerkplaats',-13,4.2,4.5,4.4,'blue'),('B0.15','',-9,5,3,5.6,'blue'),('B0.09','Composietenlab',-11.9,-7.3,5.3,2.6,'orange'),('B0.08','',-7.6,-7.2,2.7,2.6,'yellow'),
 ('B0.24','',-3.9,10.4,4.3,4.8,'wall'),('B0.26','',2.3,10.4,4.8,4.8,'wall'),('B0.27','',6.6,10.4,2.4,4.8,'wall'),('B0.28','',9.6,10.4,2.5,4.8,'wall'),
 ('B0.30','',13.3,12.7,2,3.8,'wall'),('B0.31','',15.5,12.7,1.8,3.8,'wall'),('B0.32','',14.4,7.2,4.4,5.5,'wall'),('B0.38','National Science',13.7,2.3,3.4,2.2,'orange'),
 ('B0.42','Metalworkplaats',12.1,-5.1,9.2,4.4,'deepblue'),('B0.44','Metalworkplaats',3.1,-5,8,4.2,'deepblue'),('A0.20','AV studio',3,-10.2,3.5,4.3,'olive'),('A0.21','AV studio',3,-14,4.2,3.3,'sage')]
LEVEL_2 = [
 ('B1.24','',-12.4,6.5,6.4,10,'wall'),('B1.18','Usability lab',-12.1,-1.2,5.2,2.6,'teal'),('B1.16','Usability lab / observeerruimte',-12.1,-4.3,5.2,2.4,'teal'),
 ('B1.12','College zaal',-11.2,-9.2,6.8,4.6,'wall'),('B1.36','',-3.3,9.3,3.8,4.7,'wall'),('B1.36a','',-3.2,5.6,3.7,1.8,'wall'),('B1.44','HAN Datalab',3.2,9.2,6.5,5.4,'yellow'),
 ('B1.46','Media lab',10.7,9,6.6,5.4,'brown'),('B1.54','',15.1,5.1,1.6,2,'teal'),('B1.56','',14.4,2,3.1,4.5,'wall'),('B1.58','',14.2,-1.7,3.6,2.1,'wall'),
 ('B1.62','',13.3,-5.2,3.8,2.2,'wall'),('B1.64','',14,-8.3,4.9,3.9,'wall'),('B1.66','',12.9,-10.5,4.4,2,'wall'),('B1.25','',9,3,2,2.1,'pink'),
 ('B1.29','ICT lab 1',8.7,-1.4,3.2,7.5,'wall'),('B1.88','',1.8,-10,4.4,3.6,'wall'),('B1.84','',6.4,-10,3.8,3.6,'wall'),('B1.80','',10.1,-10,3.6,3.6,'wall')]

PALETTE = {'navy':(.01,.06,.16,1),'purple':(.34,.05,.31,1),'blue':(.16,.48,.68,1),'orange':(.92,.22,.01,1),'yellow':(.98,.76,.02,1),'deepblue':(.025,.12,.36,1),'olive':(.46,.58,.04,1),'sage':(.28,.48,.28,1),'teal':(.04,.26,.27,1),'brown':(.40,.34,.24,1),'pink':(.78,.38,.45,1),'wall':(.74,.75,.72,1),'floor':(.34,.36,.36,1)}

# Unit cube: position + normal, z-up. Nodes scale this to room footprints.
P = [(-.5,-.5,-.5),(.5,-.5,-.5),(.5,.5,-.5),(-.5,.5,-.5),(-.5,-.5,.5),(.5,-.5,.5),(.5,.5,.5),(-.5,.5,.5)]
N = [(0,0,-1)]*4 + [(0,0,1)]*4
IDX = [0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7]

def pad(data): return data + b'\0' * ((4-len(data)%4)%4)

def write_glb(filename, rooms, level_name):
    blob = bytearray()
    pos_off=len(blob); blob.extend(struct.pack('<'+'f'*24,*[v for p in P for v in p])); blob[:]=pad(blob)
    nrm_off=len(blob); blob.extend(struct.pack('<'+'f'*24,*[v for p in N for v in p])); blob[:]=pad(blob)
    idx_off=len(blob); blob.extend(struct.pack('<'+'H'*len(IDX),*IDX)); blob[:]=pad(blob)
    # mesh 0 is floor, remaining meshes are colored unit cubes
    keys=['floor']+sorted(set(r[-1] for r in rooms))
    mats=[{'name':k,'pbrMetallicRoughness':{'baseColorFactor':PALETTE[k],'metallicFactor':0,'roughnessFactor':.55}} for k in keys]
    meshes=[{'name':k,'primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2,'material':i}]} for i,k in enumerate(keys)]
    key_mesh={k:i for i,k in enumerate(keys)}
    nodes=[{'name':level_name+' floor','mesh':0,'translation':[0,0,-.16],'scale':[36,32,.25],'extras':{'kind':'floor','level':level_name}}]
    for code,label,x,y,w,d,key in rooms:
        nodes.append({'name':code,'mesh':key_mesh[key],'translation':[x,y,.16],'scale':[w,d,.32],'extras':{'kind':'room','code':code,'label':label,'level':level_name}})
    doc={'asset':{'version':'2.0','generator':'HAN indoor floor map exporter'},'scene':0,'scenes':[{'name':level_name,'nodes':list(range(len(nodes)))}],
         'nodes':nodes,'meshes':meshes,'materials':mats,
         'buffers':[{'byteLength':len(blob)}],
         'bufferViews':[{'buffer':0,'byteOffset':pos_off,'byteLength':96,'target':34962},{'buffer':0,'byteOffset':nrm_off,'byteLength':96,'target':34962},{'buffer':0,'byteOffset':idx_off,'byteLength':72,'target':34963}],
         'accessors':[{'bufferView':0,'componentType':5126,'count':8,'type':'VEC3','min':[-.5,-.5,-.5],'max':[.5,.5,.5]},{'bufferView':1,'componentType':5126,'count':8,'type':'VEC3'},{'bufferView':2,'componentType':5123,'count':36,'type':'SCALAR'}]}
    js=pad(json.dumps(doc,separators=(',',':')).encode())
    out=struct.pack('<4sII',b'glTF',2,12+8+len(js)+8+len(blob))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(blob),b'BIN\0')+blob
    (OUT/filename).write_bytes(out)

write_glb('HAN_Arnhem_Indoor_Level_1.glb',LEVEL_1,'Level 1')
write_glb('HAN_Arnhem_Indoor_Level_2.glb',LEVEL_2,'Level 2')
print('Wrote website-ready GLB indoor maps')
