import * as BABYLON from 'babylonjs';
import * as BGUI from 'babylonjs-gui';
import {Tween} from "./Tween";

export class MainMenu {
    private _scene:BABYLON.Scene;
    private _panel:BGUI.Rectangle;
    private _tweenManager:BABYLON.Animatable;

    constructor(scene : BABYLON.Scene) {
        this._scene = scene;

        let advancedTexture = BGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        this._panel = new BGUI.Rectangle();
        this._panel.width = 0.8;
        this._panel.height = 0.6;
        this._panel.cornerRadius = 20;
        this._panel.color = "#73938D";
        this._panel.thickness = 4;
        this._panel.background = "#EEECE7";
        advancedTexture.addControl(this._panel);  
        
        let buttonSize = "100px";
        let button = BGUI.Button.CreateImageWithCenterTextButton("but", "RT", "assets/2D/big_arrow_right@2x.png");
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.width = buttonSize;
        button.height = buttonSize;
        button.left = 200;
        button.top = 0;
        button.fontSize = "36px";
        button.color = "#ffffff";
        button.thickness = 0;
        
        this._panel.addControl(button);
        this._tweenManager = Tween.createTween1D(this._scene, button, "left", 1000, 200, 
                            .5, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE,
                            new BABYLON.BounceEase(1, 10),
                            BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this._tweenManager.disposeOnEnd = false;
        
        button = BGUI.Button.CreateImageWithCenterTextButton("but", "LT", "assets/2D/big_arrow_left@2x.png");
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.width = buttonSize;
        button.height = buttonSize;
        button.left = -200;
        button.top = 0;
        button.fontSize = "36px";
        button.color = "#ffffff";
        //button.fontFamily = "";
        button.thickness = 0;
        
        this._panel.addControl(button);
        Tween.addTween1D(this._tweenManager, button, "left", -1000, -200, 
        .5, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE,
        new BABYLON.BounceEase(1, 10),
        BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        
        button = BGUI.Button.CreateSimpleButton("button1", "LEVEL SELECTION");
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.width = 0.5;
        button.top = 10;
        button.cornerRadius = 10;
        button.thickness = 4;
        button.height = "40px";
        button.color = "#00738E";
        button.background = "#2C89A0";
        
        this._panel.addControl(button);
        
        
        let horStack = new BGUI.StackPanel();
        horStack.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
        horStack.top = "70px";
        horStack.width = 1;
        horStack.height = 0.7;
        horStack.isVertical = false;
        
        this._panel.addControl(horStack); 

        let grid1 = this.createGrid(2, 1);
        grid1.paddingLeft = grid1.paddingRight = 0;
        grid1.width = 0.5;
        grid1.height = 1;
        horStack.addControl(grid1);
        
        let rect = new BGUI.Rectangle();
        rect.background = "#504738";
        rect.color = "#2E0D00";
        rect.cornerRadius = 10;
        rect.thickness = 1;
        let grid2 = this.createGrid(10, 2, rect, [0.5], [0.6, 0.4]);
        grid2.paddingLeft = grid2.paddingRight = 0;
        grid2.width = 0.5;
        grid2.height = 1;
        horStack.addControl(grid2);

        let row;
        for(row = 0; row < 10; row++){
            grid2.addControl(new Selector("Var"+row), row, 1);
        }   
        this.show(false);
    }

    private createGrid(nrow:number, ncol:number, cellObject?:BGUI.Control, 
        rowsizes?:number[], colsizes?:number[]) : BGUI.Grid {
    
        if(cellObject === undefined){
            let rect = new BGUI.Rectangle();
            rect.background = "white";
            rect.color = "black";
            rect.cornerRadius = 20;
            rect.thickness = 1;
            cellObject = rect;
        }

        let grid = new BGUI.Grid();   
        grid.background = "#00000000"; 
        
        let col;
        for (col = 0; col < ncol; col++){
            if(colsizes)
                grid.addColumnDefinition(colsizes[col % colsizes.length]);
            else
                grid.addColumnDefinition(0.5);
        }
        let row;
        for (row = 0; row < nrow; row++){
            if(rowsizes)
                grid.addRowDefinition(rowsizes[row % rowsizes.length]);
            else
                grid.addRowDefinition(0.5);
            }
        
        for (row = 0; row < nrow; row++){
            for (col = 0; col < nrow; col++){
                grid.addControl(cellObject, row, col);     
            }
        }
        return grid
    }

    public show(b:boolean){
        this._panel.isVisible = b;
        if(b){
            this._tweenManager.reset();
            this._tweenManager.restart();
        }
        else{
            this._tweenManager.pause();
        }

    }

    public toggle(){
        this.show(!this._panel.isVisible);
    }
}

class Selector extends BGUI.Container {
    buttonUp:BGUI.Button;
    buttonDown:BGUI.Button;
    varText:BGUI.TextBlock;
    buttonSize:string = "32px";
    constructor(initText:string){
        super();
        this.buttonUp = BGUI.Button.CreateImageOnlyButton("but", "assets/2D/small_arrow_right@2x.png");
        this.buttonUp.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.buttonUp.width = this.buttonSize;
        this.buttonUp.height = this.buttonSize;
        this.buttonUp.thickness = 0;
    
        this.buttonDown = BGUI.Button.CreateImageOnlyButton("but", "assets/2D/small_arrow_left@2x.png");
        this.buttonDown.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.buttonDown.width = this.buttonSize;
        this.buttonDown.height = this.buttonSize;
        this.buttonDown.thickness = 0;
        
        this.varText = new BGUI.TextBlock();
        this.varText.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.varText.text = initText;
        this.varText.color = "white";

        this.addControl(this.buttonUp);
        this.addControl(this.buttonDown);
        this.addControl(this.varText);

    }
}