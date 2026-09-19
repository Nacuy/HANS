"""Public-map-based, web-optimized HAN Arnhem campus scene.
Footprints are interpreted from OpenStreetMap and HAN's published campus map;
they are not a surveyed/BIM model.
"""
import bpy
import math
from mathutils import Vector

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

def material(name, rgba, metallic=0.0, roughness=0.55):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = rgba
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    mat.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    shader.inputs["Base Color"].default_value = rgba
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    return mat

navy = material("HAN navy", (0.008, 0.055, 0.14, 1), .12, .3)
blue = material("HAN blue", (0.0, .28, .45, 1), .05, .32)
cyan = material("HAN cyan", (0.0, .64, .77, 1), .05, .28)
orange = material("HAN orange", (1.0, .24, .015, 1), 0, .4)
concrete = material("Concrete", (.66, .68, .65, 1), 0, .76)
asphalt = material("Asphalt", (.09, .105, .115, 1), 0, .92)
glass = material("Glass", (.018, .16, .24, 1), .45, .16)
green = material("Grass", (.045, .25, .12, 1), 0, .88)
treegreen = material("Tree canopy", (.012, .19, .07, 1), 0, .9)
water = material("Water", (.01, .24, .38, 1), .4, .14)
white = material("Wayfinding", (.88, .93, .92, 1), 0, .48)

def box(name, loc, dims, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name, obj.dimensions = name, dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        bevel_mod = obj.modifiers.new("Rounded edges", "BEVEL")
        bevel_mod.width, bevel_mod.segments = bevel, 2
    return obj

def prism(name, outline, height, mat, z=0, bevel=0.18):
    count = len(outline)
    verts = [(x, y, z) for x, y in outline] + [(x, y, z + height) for x, y in outline]
    faces = [list(range(count)), list(range(count, count * 2))]
    faces += [[i, (i + 1) % count, (i + 1) % count + count, i + count] for i in range(count)]
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    if bevel:
        bevel_mod = obj.modifiers.new("Soft architectural edges", "BEVEL")
        bevel_mod.width, bevel_mod.segments = bevel, 2
    return obj

def text(body, location, size, mat):
    bpy.ops.object.text_add(location=location)
    obj = bpy.context.object
    obj.name = body
    obj.data.body, obj.data.align_x, obj.data.align_y = body, "CENTER", "CENTER"
    obj.data.size, obj.data.extrude, obj.data.bevel_depth = size, .025, .006
    obj.data.materials.append(mat)
    return obj

def tree(x, y, scale=1):
    bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=.11 * scale, depth=1.2 * scale, location=(x, y, .6 * scale))
    bpy.context.object.data.materials.append(concrete)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.72 * scale, location=(x, y, 1.55 * scale))
    crown = bpy.context.object
    crown.name = "Tree"
    crown.scale = (1, 1, 1.15)
    crown.data.materials.append(treegreen)

# Site base oriented as a simplified public-map extract: IJssellaan north-west,
# campus entrance and parking on the Ruitenberglaan side.
box("Campus ground", (0, 0, -.55), (58, 46, 1.1), green, .5)
box("IJssellaan", (-23, 9, .04), (4.8, 43, .16), asphalt, .1)
box("Ruitenberglaan", (2, -18.2, .04), (53, 5.2, .16), asphalt, .1)
box("Campus approach", (-10, -12.8, .06), (4, 15, .18), asphalt, .08)
for y in range(-8, 25, 5):
    box("IJssellaan marking", (-23, y, .15), (.17, 2.4, .035), white)
for x in range(-18, 25, 5):
    box("Ruitenberglaan marking", (x, -18.2, .15), (2.2, .17, .035), white)

# Parking, bike fields and a public-green courtyard
box("Visitor parking", (-6.5, -12.0, .1), (23, 7.0, .2), asphalt, .08)
for x in range(-16, 5, 3):
    for y in (-14.1, -11.8, -9.5):
        box("Parking line", (x, y, .22), (1.7, .09, .035), white)
box("Central campus square", (1.0, -1.4, .11), (14.5, 8.6, .22), concrete, .18)
box("Green court", (1.4, 6.0, .08), (17.0, 7.5, .17), green, .3)
box("Bike parking", (13.0, -5.6, .16), (9.0, 3.2, .25), asphalt, .1)
for x in range(10, 17):
    box("Bike rack", (x, -5.6, .38), (.08, 2.2, .42), concrete, .025)

# Building footprints modelled from the public map's relative outlines.
# R29: Academy Engineering and Automotive (north-west)
r29 = [(-18, 15), (-4, 15), (-1, 11), (-1, 1), (-7, -2), (-17, 1), (-20, 7)]
prism("R29 Academy Engineering and Automotive", r29, 8.6, navy, 0.18)
# R31: Academy International School of Business (east)
r31 = [(7, 15), (22, 15), (24, 9), (20, 5), (23, 1), (18, -5), (8, -3), (5, 3)]
prism("R31 International School of Business", r31, 7.2, blue, 0.18)
# R27: library / education building, lower-centre
r27 = [(-8, -4), (6, -4), (9, -8), (5, -12), (-7, -11), (-11, -7)]
prism("R27 Library and Education", r27, 5.0, concrete, 0.18)
# R26: western building and wing
r26 = [(-19, -4), (-12, -3), (-12, -10), (-18, -12), (-22, -9), (-22, -5)]
prism("R26 Built Environment", r26, 6.0, cyan, 0.18)

# Legible facade / entrance accents and roof markers
box("R29 glazed entrance", (-4.0, 1.0, 2.1), (5.6, .18, 3.8), glass, .03)
box("R31 glazed entrance", (8.6, -2.9, 1.9), (4.6, .18, 3.3), glass, .03)
box("R27 glazed entrance", (-1.0, -3.9, 1.5), (4.3, .16, 2.6), glass, .03)
box("R26 glazed entrance", (-16.2, -3.1, 1.6), (3.6, .16, 2.8), glass, .03)
box("R29 HAN roof", (-10, 7.4, 8.9), (7.6, 1.4, .22), cyan, .08)
box("R31 HAN roof", (15, 7.0, 7.5), (6.8, 1.3, .22), cyan, .08)
box("R26 HAN roof", (-17, -7.4, 6.25), (3.8, 1.2, .22), orange, .08)

# Amenities, benches, a landmark and planting based on the published map's campus-square character
for x in (-4, -1, 2, 5):
    box("Bench", (x, -1.4, .45), (1.25, .35, .42), navy, .07)
bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=.82, radius2=0, depth=1.7, location=(1, 1.7, 1.0))
bpy.context.object.name = "Campus pin"
bpy.context.object.data.materials.append(orange)
for position in [(-20,-15,1),(-16,-15,.9),(-12,-15,1.1),(-7,-15,1),(-2,-15,.9),(5,-15,1), (20,-15,1),(-20,4,1.1),(-20,11,.9),(-15,18,1.1),(-8,18,.9),(-1,18,1),(6,18,1),(16,18,1.1),(23,12,.9),(25,5,1),(20,-5,.9),(12,-9,1),(-1,9,.85),(4,8,1)]:
    tree(*position)
text("HAN ARNHEM", (2, -21.2, .25), 1.2, white)
text("RUITENBERGLAAN CAMPUS  •  PUBLIC-MAP MODEL", (2, -22.6, .25), .38, white)
for label, pos in [("R29", (-10, 9, 8.86)), ("R31", (15, 7, 7.46)), ("R27", (-1, -7.5, 5.26)), ("R26", (-17, -7.4, 6.36))]:
    text(label, pos, .75, white)

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()

bpy.ops.object.camera_add(location=(38, -43, 38))
camera = bpy.context.object
camera.name, camera.data.lens = "Web showcase camera", 52
look_at(camera, (0, 0, 0))
bpy.context.scene.camera = camera
bpy.ops.object.light_add(type="AREA", location=(-5, -10, 31))
bpy.context.object.data.energy, bpy.context.object.data.size = 2500, 20
bpy.ops.object.light_add(type="AREA", location=(28, 4, 17))
fill = bpy.context.object
fill.data.energy, fill.data.size = 1300, 16
look_at(fill, (0, 0, 0))
bpy.ops.object.light_add(type="SUN", location=(0, 0, 22))
bpy.context.object.data.energy = 1.7
bpy.context.object.rotation_euler = (math.radians(28), math.radians(-18), math.radians(25))

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1400, 900, 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = "/Users/yucan/Repositories/HANS/HAN_Arnhem_Public_Map_Render.png"
scene.world.color = (.018, .025, .04)
scene.view_settings.look = "AgX - Medium High Contrast"
bpy.ops.wm.save_as_mainfile(filepath="/Users/yucan/Repositories/HANS/HAN_Arnhem_Public_Map.blend")
bpy.ops.export_scene.gltf(filepath="/Users/yucan/Repositories/HANS/HAN_Arnhem_Public_Map.glb", export_format="GLB", export_materials="EXPORT", export_apply=True)
bpy.ops.render.render(write_still=True)
print("Public-map-based HAN Arnhem web model saved as BLEND and GLB")
