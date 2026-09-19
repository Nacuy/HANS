import bpy
import math
from mathutils import Vector

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

def make_material(name, color, metallic=0.0, roughness=0.55):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1)
    # Build nodes explicitly because Blender 5.2 no longer initializes them
    # through the deprecated material.use_nodes switch.
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    material.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    return material

navy = make_material("HAN Navy", (0.015, 0.08, 0.18), 0.15, 0.32)
cyan = make_material("HAN Cyan", (0.0, 0.64, 0.78), 0.05, 0.28)
orange = make_material("HAN Orange", (1.0, 0.27, 0.03), 0, 0.4)
concrete = make_material("Warm Concrete", (0.45, 0.47, 0.45), 0, 0.8)
facade = make_material("Building Facade", (0.78, 0.82, 0.80), 0, 0.62)
glass = make_material("Blue Glass", (0.02, 0.22, 0.32), 0.5, 0.18)
green = make_material("Landscape Green", (0.08, 0.31, 0.16), 0, 0.8)
foliage = make_material("Tree Canopy", (0.025, 0.22, 0.08), 0, 0.9)
water = make_material("Water", (0.01, 0.24, 0.40), 0.35, 0.12)
paths = make_material("Paths", (0.13, 0.15, 0.16), 0, 0.9)
white = make_material("Type White", (0.93, 0.96, 0.94), 0, 0.45)

def cube(name, loc, dims, material, bevel=0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    if bevel:
        modifier = obj.modifiers.new("Soft edges", "BEVEL")
        modifier.width, modifier.segments = bevel, 3
    return obj

def cylinder(name, loc, radius, depth, material):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return obj

def label(body, loc, size, material):
    bpy.ops.object.text_add(location=loc)
    obj = bpy.context.object
    obj.name = body.replace(" ", "_")
    obj.data.body = body
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = 0.035
    obj.data.bevel_depth = 0.008
    obj.data.materials.append(material)
    return obj

def tree(x, y, scale=1):
    cylinder("Tree trunk", (x, y, 0.65 * scale), 0.11 * scale, 1.25 * scale, concrete)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.72 * scale, location=(x, y, 1.65 * scale))
    canopy = bpy.context.object
    canopy.name = "Tree canopy"
    canopy.scale = (1, 1, 1.12)
    canopy.data.materials.append(foliage)

# Terrain, water, and circulation
cube("Arnhem campus terrain", (0, 0, -0.45), (34, 24, 0.9), green, 0.35)
cube("Water feature", (-11, 4, 0.03), (7.2, 4.3, 0.12), water, 0.14)
cube("Canal edge", (-11, 6.25, 0.13), (7.4, 0.35, 0.16), concrete, 0.05)
cube("Ruitenberglaan road", (0, -8, 0.08), (29, 2.35, 0.16), paths, 0.12)
cube("Main pedestrian spine", (0, 0, 0.1), (2.4, 17.5, 0.18), concrete, 0.1)
cube("West walkway", (-7, 2.7, 0.1), (9.5, 1.45, 0.18), concrete, 0.08)
cube("East walkway", (7, 2.5, 0.1), (11, 1.45, 0.18), concrete, 0.08)
cube("North walkway", (0, 7.4, 0.1), (19, 1.3, 0.18), concrete, 0.08)

# Main HAN buildings: intentionally editable conceptual massing
cube("HAN Ruitenberglaan 26", (-6.7, 2.4, 2.55), (7.4, 5.4, 5.0), facade, 0.22)
cube("HAN Ruitenberglaan 29", (6.6, 2.7, 3.35), (8.3, 5.9, 6.6), navy, 0.24)
cube("HAN Ruitenberglaan 31", (3, 8.7, 2.25), (10, 4.2, 4.4), facade, 0.22)
cube("Innovation pavilion", (-7.8, 8.3, 1.55), (5.8, 3.8, 3.0), cyan, 0.2)
for x, y, width, height in [(-6.7, -0.34, 7.65, 3.55), (6.6, -0.29, 8.55, 4.8), (3, 6.56, 10.2, 3.1)]:
    cube("Glass frontage", (x, y, height / 2), (width, 0.12, height), glass, 0.03)
cube("HAN roof marker", (-6.7, 2.4, 5.16), (4.2, 1.15, 0.2), orange, 0.08)
cube("HAN roof marker", (6.6, 2.7, 6.76), (4.8, 1.25, 0.2), cyan, 0.08)

cube("Central plaza", (0, -1.5, 0.12), (8, 4.1, 0.22), facade, 0.18)
for x in (-3.2, -1.6, 1.6, 3.2):
    cube("Bench", (x, -1.4, 0.42), (1.1, 0.34, 0.35), navy, 0.07)
for x in range(-12, 13, 3):
    cube("Parking bay", (x, -8, 0.19), (1.8, 0.08, 0.03), white)
cube("Bus stop", (10.7, -6.8, 0.8), (3.2, 0.55, 1.35), cyan, 0.12)
for position in [(-13,-5,1),(-10,-4.7,.85),(-7,-5.1,1),(-3,-5,.9),(4,-5.1,1),(8,-4.9,.9),(12,-5,1),(-13,1.5,1.1),(-13,7.6,.9),(-10,8.5,1),(10,8.5,1.1),(13,6.7,.95),(12,1.2,1),(9,0,.85),(-3,9.5,.9)]:
    tree(*position)

label("HAN", (-6.7, 2.4, 5.33), 1.0, orange)
label("RUITENBERGLAAN 26", (-6.7, -0.55, 0.34), 0.47, navy)
label("RUITENBERGLAAN 29", (6.6, -0.55, 0.34), 0.47, navy)
label("RUITENBERGLAAN 31", (3, 6.35, 0.34), 0.46, navy)
label("HAN ARNHEM", (-0.2, -10, 0.25), 1.15, white)
label("CITY CAMPUS  |  CONCEPT MAP", (0, -10.9, 0.25), 0.36, white)
cylinder("Campus pin", (0, 0.2, 0.48), 0.42, 0.65, orange)
bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=.67, radius2=0, depth=1.1, location=(0, 0.2, 1.24))
bpy.context.object.name = "Campus location marker"
bpy.context.object.data.materials.append(orange)

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()

bpy.ops.object.camera_add(location=(30, -33, 31))
camera = bpy.context.object
camera.name = "Presentation Camera"
camera.data.lens = 48
look_at(camera, (0, 0, 0))
bpy.context.scene.camera = camera
bpy.ops.object.light_add(type="AREA", location=(2, -4, 25))
bpy.context.object.data.energy, bpy.context.object.data.shape, bpy.context.object.data.size = 2400, "DISK", 18
bpy.ops.object.light_add(type="AREA", location=(-20, -6, 12))
fill = bpy.context.object
fill.data.energy, fill.data.size = 1100, 12
look_at(fill, (0, 0, 0))
bpy.ops.object.light_add(type="SUN", location=(0, 0, 20))
sun = bpy.context.object
sun.data.energy = 2.0
sun.rotation_euler = (math.radians(25), math.radians(-20), math.radians(25))

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1100, 800, 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = "/Users/yucan/Repositories/HANS/HAN_Arnhem_3D_Campus_Render.png"
scene.world.color = (0.025, 0.035, 0.05)
scene.view_settings.look = "AgX - Medium High Contrast"
bpy.ops.wm.save_as_mainfile(filepath="/Users/yucan/Repositories/HANS/HAN_Arnhem_3D_Campus.blend")
bpy.ops.render.render(write_still=True)
print("HAN Arnhem campus model created and saved")
