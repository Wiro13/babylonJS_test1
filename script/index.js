var canvas = document.getElementById("renderCanvas");

        var startRenderLoop = function (engine, canvas) {
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        }

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3, -15), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 3, 0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.9;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);

    // initialize plugin
    var hk = new BABYLON.HavokPlugin();
    // enable physics in the scene with a gravity
    scene.enablePhysics(new BABYLON.Vector3(0, -1, 0), hk);

    // Create a static box shape.
    var groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

    var boxesSize = 1;
    var boxesHeight = 3;
    var yOffset = 0.5;

    // Create boxes that start in sleep mode
    createBoxes(boxesSize, boxesHeight, true, new BABYLON.Vector3(-2, 0, 0), yOffset, scene);
    createLabel(scene, new BABYLON.Vector3(-3, 3, 0), "Start asleep");
    // Create boxes that start awake
    createBoxes(boxesSize, boxesHeight, false, new BABYLON.Vector3(2, 0, 0), yOffset, scene);
    createLabel(scene, new BABYLON.Vector3(1, 3, 0), "Start awake");

    var ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui");

    var btn = BABYLON.GUI.Button.CreateSimpleButton("btn", "Drop object on towers");
    btn.widthInPixels = 300;
    btn.heightInPixels = 40;
    btn.background = "green";
    btn.color = "white";
    btn.top = "-40%";
    btn.onPointerClickObservable.add(() => {
        createBoxes(0.2, 1, false, new BABYLON.Vector3(-2, 5, 0), 0, scene);
        createBoxes(0.2, 1, false, new BABYLON.Vector3(2, 5, 0), 0, scene);
    });
    ui.addControl(btn);

    return scene;
};

function createLabel(scene, position, text) {
    var dynamicTexture = new BABYLON.DynamicTexture(
        "dynamicTexture" + text,
        512,
        scene,
        true
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
        text,
        null,
        null,
        "32px Arial",
        "white",
        "transparent"
    );

    var plane = BABYLON.Mesh.CreatePlane("label" + text, 2, scene);
    plane.scaling.scaleInPlace(3);
    plane.position.copyFrom(position);
    plane.position.y += 2.5;
    plane.position.x += 1.4;
    plane.rotation.z += 1;
    plane.material = new BABYLON.PBRMaterial("material" + text, scene);
    plane.material.unlit = true;
    plane.material.backFaceCulling = false;
    plane.material.albedoTexture = dynamicTexture;
    plane.material.useAlphaFromAlbedoTexture = true;
}


function createBoxes(size, numBoxes, startAsleep, pos, yOffset, scene) {
    for (let i = 0; i < numBoxes; i++) {
        var box = BABYLON.MeshBuilder.CreateBox("box", {size }, scene);
        box.material = new BABYLON.StandardMaterial("boxMat", scene);
        box.material.diffuseColor = BABYLON.Color3.Random();
        box.position = pos.clone();
        box.position.y += i * (yOffset + size) + 0.5;
        new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: 1, startAsleep }, scene);
    }
}
                window.initFunction = async function() {
                    
                    globalThis.HK = await HavokPhysics();
                    
                    var asyncEngineCreation = async function() {
                        try {
                        return createDefaultEngine();
                        } catch(e) {
                        console.log("the available createEngine function failed. Creating the default engine instead");
                        return createDefaultEngine();
                        }
                    }

                    window.engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        startRenderLoop(engine, canvas);
        window.scene = createScene();};
        initFunction().then(() => {sceneToRender = scene                    
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });