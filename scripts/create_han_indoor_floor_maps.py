"""Create two web-ready indoor 3D guide maps from supplied HAN floor-plan images.
The model is intentionally a clean, navigable isometric map rather than BIM geometry.
"""
import bpy
import math
from mathutils import Vector

OUT = "/Users/yucan/Repositories/HANS/"

def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

def make_mat(name, color):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    mat.node_tree.links.new(shader.outputs["BSDF"], out.inputs["Surface"])
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = .48
    return mat

navy = make_mat("HAN navy", (.012, .065, .16))
cyan = make_mat("HAN cyan", (0, .60, .74))
yellow = make_mat("HAN yellow", (.98, .76, .02))
orange = make_mat("HAN orange", (.92, .22, .01))
purple = make_mat("FabLab purple", (.34, .05, .31))
blue = make_mat("Workshop blue", (.16, .48, .68))
deepblue = make_mat("Metal workshop", (.025, .12, .36))
teal = make_mat("Usability teal", (.04, .26, .27))
olive = make_mat("AV olive", (.46, .58, .04))
sage = make_mat("AV sage", (.28, .48, .28))
floor = make_mat("Main circulation", (.70, .71, .68))
wall = make_mat("Walls", (.93, .94, .91))
ink = make_mat("Labels", (.02, .03, .045))
white = make_mat("White labels", (.95, .97, .96))
red = make_mat("Safety red", (.78, .01, .13))

def box(name, loc, dims, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name, obj.dimensions = name, dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        modifier = obj.modifiers.new("soft edges", "BEVEL")
        modifier.width, modifier.segments = bevel, 2
    return obj

def label(value, loc, size=.55, mat=ink):
    bpy.ops.object.text_add(location=loc)
    obj = bpy.context.object
    obj.name = value
    obj.data.body = value
    obj.data.align_x, obj.data.align_y = "CENTER", "CENTER"
    obj.data.size, obj.data.extrude, obj.data.bevel_depth = size, .025, .006
    obj.data.materials.append(mat)
    return obj

def room(code, desc, x, y, w, d, color, code_color=ink):
    box(code, (x, y, .13), (w, d, .18), color, .10)
    label(code, (x, y + .22, .25), min(.68, w / max(3.8, len(code) * .78)), code_color)
    if desc:
        label(desc, (x, y - .48, .25), min(.37, w / max(6.2, len(desc) * .34)), code_color)

def wall_line(x1, y1, x2, y2):
    length = math.dist((x1, y1), (x2, y2))
    obj = box("Wall", ((x1+x2)/2, (y1+y2)/2, .5), (length, .16, .95), wall, .025)
    obj.rotation_euler[2] = math.atan2(y2-y1, x2-x1)

def stair(x, y, w=2.0, d=1.5, rotation=0):
    # compact, clearly-readable stairway glyph in 3D
    for index in range(6):
        step = box("Stair", (x, y - d/2 + .15 + index*.22, .15 + index*.06), (w, .19, .14 + index*.06), wall, .01)
        step.rotation_euler[2] = rotation
    label("STAIRS", (x, y, .62), .26, red)

def icon(text_value, x, y):
    box("Safety icon", (x, y, .21), (.7, .62, .12), red, .06)
    label(text_value, (x, y, .29), .28, white)

def shell(minx, miny, maxx, maxy):
    box("Floor slab", ((minx+maxx)/2, (miny+maxy)/2, -.10), (maxx-minx, maxy-miny, .2), floor, .34)
    wall_line(minx,miny,maxx,miny); wall_line(maxx,miny,maxx,maxy)
    wall_line(maxx,maxy,minx,maxy); wall_line(minx,maxy,minx,miny)

def scene_camera(title, outfile):
    bpy.ops.object.camera_add(location=(29, -34, 34))
    camera = bpy.context.object
    camera.name, camera.data.lens = title + " Camera", 53
    camera.rotation_euler = (Vector((0,0,0))-camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    bpy.ops.object.light_add(type="AREA", location=(0, -5, 25))
    bpy.context.object.data.energy, bpy.context.object.data.size = 1900, 22
    bpy.ops.object.light_add(type="AREA", location=(17, 7, 12))
    fill = bpy.context.object
    fill.data.energy, fill.data.size = 950, 12
    fill.rotation_euler = (Vector((0,0,0))-fill.location).to_track_quat("-Z", "Y").to_euler()
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1400, 1000, 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = OUT + outfile + "_preview.png"
    scene.world.color = (.026, .033, .052)
    scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.ops.wm.save_as_mainfile(filepath=OUT + outfile + ".blend")
    bpy.ops.export_scene.gltf(filepath=OUT + outfile + ".glb", export_format="GLB", export_materials="EXPORT", export_apply=True)
    bpy.ops.render.render(write_still=True)

def floor_one():
    # Image #2 / B0 level supplied by user
    clear(); shell(-17, -15, 17, 15)
    room("B0.16", "FabLab", -12, 9.1, 7.1, 6.0, purple, white)
    room("B0.17", "", -13.2, 13.0, 5.0, 2.5, purple, white)
    room("B0.18", "", -7.5, 12.8, 3.1, 2.8, purple, white)
    room("B0.14", "Houtwerkplaats", -13.0, 4.2, 4.5, 4.4, blue, white)
    room("B0.15", "", -9.0, 5.0, 3.0, 5.6, blue, white)
    room("B0.09", "Composietenlab", -11.9, -7.3, 5.3, 2.6, orange)
    room("B0.08", "", -7.6, -7.2, 2.7, 2.6, yellow)
    room("B0.24", "", -3.9, 10.4, 4.3, 4.8, wall)
    room("B0.26", "", 2.3, 10.4, 4.8, 4.8, wall)
    room("B0.27", "", 6.6, 10.4, 2.4, 4.8, wall)
    room("B0.28", "", 9.6, 10.4, 2.5, 4.8, wall)
    room("B0.30", "", 13.3, 12.7, 2.0, 3.8, wall)
    room("B0.31", "", 15.5, 12.7, 1.8, 3.8, wall)
    room("B0.32", "", 14.4, 7.2, 4.4, 5.5, wall)
    room("B0.38", "National Science", 13.7, 2.3, 3.4, 2.2, orange, white)
    room("B0.40", "", 11.7, 1.3, 3.3, 4.0, wall)
    room("B0.42", "Metalworkplaats", 12.1, -5.1, 9.2, 4.4, deepblue, white)
    room("B0.44", "Metalworkplaats", 3.1, -5.0, 8.0, 4.2, deepblue, white)
    room("B0.46", "", 8.2, -5.2, 2.0, 2.4, navy, white)
    room("A0.20", "AV studio", 3.0, -10.2, 3.5, 4.3, olive)
    room("A0.21", "AV studio", 3.0, -14.0, 4.2, 3.3, sage, white)
    # three landmark-shaped circulation islands from B0.01/B0.04/B0.06
    for code, x, y in [("B0.01", -6, 2), ("B0.04", 5, 4.1), ("B0.06", 0.8, -1.5)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=1.35, depth=.14, location=(x,y,.08))
        bpy.context.object.name = code + " circulation island"; bpy.context.object.data.materials.append(wall)
        label(code, (x,y,.18), .38, ink)
    # clean internal partitions and circulation thresholds
    for line in [(-6,7,-6,13),(-1,7,-1,13),(5,7,5,13),(8,7,8,13),(11,7,11,13),(-6,-8,-6,-3),(7,-8,7,-3),(10,-8,10,-3)]: wall_line(*line)
    for x,y in [(-7.1,8.3),(-8.3,-6.1),(12.1,0),(1.0,-8.4)]: stair(x,y)
    for x,y,t in [(-5.6,8.0,"↑"),(-8.2,-5.4,"↑"),(12.6,1.3,"↑"),(1.5,-8.3,"↑")]: icon(t,x,y)
    label("HAN ARNHEM  •  LEVEL 1  •  INDOOR GUIDE", (0,-16.6,.25), .55, white)
    scene_camera("Level 1", "HAN_Arnhem_Indoor_Level_1")

def floor_two():
    # Image #1 / B1 level supplied by user
    clear(); shell(-17, -13, 17, 13)
    room("B1.24", "", -12.4, 6.5, 6.4, 10.0, wall)
    room("B1.18", "Usability lab", -12.1, -1.2, 5.2, 2.6, teal, white)
    room("B1.16", "Usability lab\n(observeerruimte)", -12.1, -4.3, 5.2, 2.4, teal, white)
    room("B1.12", "College zaal", -11.2, -9.2, 6.8, 4.6, wall)
    room("B1.36", "", -3.3, 9.3, 3.8, 4.7, wall)
    room("B1.36a", "", -3.2, 5.6, 3.7, 1.8, wall)
    room("B1.44", "HAN Datalab", 3.2, 9.2, 6.5, 5.4, yellow)
    room("B1.46", "Media lab", 10.7, 9.0, 6.6, 5.4, make_mat("Media brown", (.40,.34,.24)), white)
    room("B1.54", "", 15.1, 5.1, 1.6, 2.0, teal)
    room("B1.56", "", 14.4, 2.0, 3.1, 4.5, wall)
    room("B1.58", "", 14.2, -1.7, 3.6, 2.1, wall)
    room("B1.62", "", 13.3, -5.2, 3.8, 2.2, wall)
    room("B1.64", "", 14.0, -8.3, 4.9, 3.9, wall)
    room("B1.66", "", 12.9, -10.5, 4.4, 2.0, wall)
    room("B1.25", "", 9.0, 3.0, 2.0, 2.1, make_mat("Admin pink", (.78,.38,.45)))
    room("B1.29", "ICT lab 1", 8.7, -1.4, 3.2, 7.5, wall)
    room("B1.88", "", 1.8, -10.0, 4.4, 3.6, wall)
    room("B1.84", "", 6.4, -10.0, 3.8, 3.6, wall)
    room("B1.80", "", 10.1, -10.0, 3.6, 3.6, wall)
    room("B1.102", "", -7.5, -10.0, 2.5, 3.6, wall)
    # central rounded B1.00 atrium
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=5.2, depth=.15, location=(.2,-.1,.08))
    atrium = bpy.context.object; atrium.name = "B1.00 central atrium"; atrium.scale=(1.35,.78,1); atrium.data.materials.append(floor)
    label("B1.00", (.2,-.1,.19), .65, ink)
    for line in [(-6,4,-6,10),(-1,5,-1,11),(6.5,5,6.5,11),(8,-6,8,3),(11,-6,11,3),(-6,-11,-6,-7),(4,-12,4,-8),(8,-12,8,-8)]: wall_line(*line)
    for x,y in [(-6.4,7.1),(-7.4,-9.0),(13.4,-3.5),(-2.0,-4.0)]: stair(x,y)
    for x,y,t in [(-5.5,7.1,"↑"),(-7.8,-8.1,"↑"),(12.4,-3.5,"↑"),(-2.8,-4.0,"↑")]: icon(t,x,y)
    label("HAN ARNHEM  •  LEVEL 2  •  INDOOR GUIDE", (0,-14.6,.25), .55, white)
    scene_camera("Level 2", "HAN_Arnhem_Indoor_Level_2")

floor_one()
floor_two()
print("Two HAN Arnhem indoor maps saved as BLEND, GLB and PNG previews")
