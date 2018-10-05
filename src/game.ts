import * as BABYLON from 'babylonjs';
import * as BGUI from 'babylonjs-gui';
import {Tween} from './Tween';
import {MainMenu} from './MainMenu';
import MenuData from "./data/MenuData.json";

class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;
    private _ground: BABYLON.Mesh;
    private _mainMenu: MainMenu;

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);    
        // Create the scene.
        this.createScene();
            
        // Create a Menu
        this.createMenu();
        
        // attach Keyboard.
        this.attachKeyboard();
        
        // Start render loop.
        this.doRender();        
    }

    createMenu() : void {
        // var assetsManager = new BABYLON.AssetsManager(scene);
        // var textTask = assetsManager.addTextFileTask("menu_data", "./assets/data/MenuData.json");
        // textTask.onSuccess = (task) => {
        //     this.data = JSON.parse(task.text);
        //     console.log(this.data);
        // }
        // textTask.onError = (task) => {
        //     console.log("failed")
        //     console.log(task.errorObject);
        // }
        // assetsManager.load();

        this._mainMenu = new MainMenu(this._scene, MenuData);
        this._mainMenu.show(true);

    }

    attachKeyboard(){
        this._scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                        case " ":
                            this._mainMenu.toggle();
                        break
                    }
                break;
            }
        });
    
    }
    
    createScene() : void {
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color3(0.6, 0.85, 0.9);
    
        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), this._scene);
        
        // Target the camera to scene origin.
        this._camera.setTarget(BABYLON.Vector3.Zero());
        
        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false);
        
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this._scene);
        
        // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
                                {segments: 16, diameter: 2}, this._scene);

        let material = new BABYLON.StandardMaterial("sphere_material", this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
        sphere.material = material;

        // Move the sphere upward 1/2 of its height.
        sphere.position.y = 1;

        // Create a built-in "ground" shape.
        this._ground = BABYLON.MeshBuilder.CreateGround('ground1',
                                {width: 6, height: 6, subdivisions: 2}, this._scene);
        
        // the path to the texture corresponds to the path after you build your project (npm run build)
        material = new BABYLON.StandardMaterial("ground1_material", this._scene);
        material.diffuseTexture = new BABYLON.Texture("assets/2D/dungeons_and_flagons3.jpg", this._scene);
        this._ground.material = material;

        let frameRate = 6;
        let duration = 6;

        let xSlide = new BABYLON.Animation("xSlide", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keyFrames = []; 

        keyFrames.push({
            frame: 0,
            value: BABYLON.Vector3.Zero(),
            outTangent: new BABYLON.Vector3(1, 0, 0)
            //interpolation: BABYLON.AnimationKeyInterpolation.STEP
        });

        keyFrames.push({
            frame: duration/2,
            inTangent: new BABYLON.Vector3(-1, 0, 0),
            value: new BABYLON.Vector3(0, 0, 1),
            outTangent: new BABYLON.Vector3(-1, 0, 0)
            //interpolation: BABYLON.AnimationKeyInterpolation.STEP
        });

        keyFrames.push({
            frame: duration,
            value: BABYLON.Vector3.Zero(),
            inTangent: new BABYLON.Vector3(1, 0, 0)
            //interpolation: BABYLON.AnimationKeyInterpolation.STEP
        });

        xSlide.setKeys(keyFrames);

        let anim = this._scene.beginDirectAnimation(sphere, [xSlide], 0, duration, true);
        anim.speedRatio = .5;

    }

    doRender() : void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new Game('renderCanvas');

});