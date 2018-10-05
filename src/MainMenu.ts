import * as BABYLON from 'babylonjs';
import * as BGUI from 'babylonjs-gui';
import {Tween} from "./Tween";
import {GridHelper} from './GUIHelper';
import { TextBlock } from 'babylonjs-gui';

interface LevelVariableData {
    ID: number,
    Name: string,
    Description: string,
    MinValue: number,
    MaxValue: number,
    StepValue: number,
    StartON: boolean
  }

interface LevelMenuData {
    Names:string[],
    ThumbnailPath:string,
    SpaceAfterVariables:number[],
    Variables:LevelVariableData[]

}

export class MainMenu {
    private _scene:BABYLON.Scene;
    public data:LevelMenuData;
    private _panel:BGUI.Rectangle;
    private _descriptionText:BGUI.TextBlock;
    private _levelThumbnail:BGUI.Image;
    private _tweenManager:BABYLON.Animatable;

    constructor(scene : BABYLON.Scene, levelMenuData:LevelMenuData) {
        this._scene = scene;
        this.data = levelMenuData;   

        let advancedTexture = BGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        // MAIN PANEL:
        this._panel = new BGUI.Rectangle();
        this._panel.width = 0.8;
        this._panel.height = 0.8;
        this._panel.cornerRadius = 20;
        this._panel.color = "#73938D";
        this._panel.thickness = 4;
        this._panel.background = "#EEECE7";
        advancedTexture.addControl(this._panel);  
        
        // HEADER (Level Selection):
        let button;       
        button = BGUI.Button.CreateSimpleButton("button1", "LEVEL SELECTION");
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.width = 0.5;
        button.fontSize = "32px";
        button.top = 10;
        button.cornerRadius = 10;
        button.thickness = 4;
        button.height = "40px";
        button.color = "#00738E";
        button.background = "#2C89A0";
        
        this._panel.addControl(button);
        
        // CONTENT (UNDER Level Selection)
        let rect = new BGUI.Rectangle();
        rect.background = "#DFD9D6";
        rect.color = "#2E0D00";
        rect.thickness = 0;
        rect.cornerRadius = 10;

        let horGrid = GridHelper.createGrid(1,2, [null, rect]);
        horGrid.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
        horGrid.top = "70px";
        horGrid.width = 0.9;
        horGrid.height = 0.7;
        horGrid.paddingLeft = 0;
        horGrid.paddingRight = 0;
        
        this._panel.addControl(horGrid); 

        // CONTENT (Left Part -- Level Image + Variable Description)
        rect = new BGUI.Rectangle();
        rect.background = "#322931";
        rect.color = "white";
        rect.paddingBottom = 20;
        rect.thickness = 0;
        rect.cornerRadius = 10;

        let image = new BGUI.Image("thumbnail", "../assets/2D/level_thumbnails/Level1.png");
        rect.addControl(image);

        let rect2 = new BGUI.Rectangle();
        rect2.background = "white";
        rect2.color = "white";
        rect2.paddingBottom = 0;
        rect2.thickness = 0;
        rect2.cornerRadius = 10;

        button = BGUI.Button.CreateImageOnlyButton("but", "./assets/2D/UI/button_y@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.height="64px";
        button.width="64px";
        button.left = 20;
        button.top = -20;
        rect2.addControl(button);
        
        this._descriptionText = new TextBlock();
        this._descriptionText.text = "This is a descriptive text...";
        this._descriptionText.color = "black";
        rect2.addControl(this._descriptionText);

        let leftPart = GridHelper.createGrid(2, 1, [rect, rect2], [0.5], [0.1, 0.9]);
        leftPart.paddingRight = 50;
        leftPart.width = 1;
        leftPart.height = 1;
        horGrid.addControl(leftPart,0,0);
        
        // CONTENT (Right Part -- Level Variables Form)
        let levelVariablesGrid = this.createLevelVariablesGrid();   
        horGrid.addControl(levelVariablesGrid, 0,1);
        
        // LEFT / RIGHT buttons:
        let buttonSize = "100px";
        button = BGUI.Button.CreateImageWithCenterTextButton("but", "RT", "assets/2D/UI/big_arrow_right@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.width = buttonSize;
        button.height = buttonSize;
        button.left = 500;
        button.top = 0;
        button.fontSize = "36px";
        button.color = "#ffffff";
        button.thickness = 0;
        
        this._panel.addControl(button);
        this._tweenManager = Tween.createTween1D(this._scene, button, "left", 500, 0, 
                            .5, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE,
                            new BABYLON.BounceEase(1, 10),
                            BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this._tweenManager.disposeOnEnd = false;
        
        button = BGUI.Button.CreateImageWithCenterTextButton("but", "LT", "assets/2D/UI/big_arrow_left@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.width = buttonSize;
        button.height = buttonSize;
        button.left = -500;
        button.top = 0;
        button.fontSize = "36px";
        button.color = "#ffffff";
        //button.fontFamily = "";
        button.thickness = 0;
        
        this._panel.addControl(button);
        Tween.addTween1D(this._tweenManager, button, "left", -500, 0, 
        .5, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE,
        new BABYLON.BounceEase(1, 10),
        BABYLON.EasingFunction.EASINGMODE_EASEOUT);

        button = BGUI.Button.CreateImageOnlyButton("but", "./assets/2D/UI/button_play@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.height="100px";
        button.width="100px";
        button.left = -100;
        button.top = 50;
        button.thickness = 0;
        this._panel.addControl(button);
        
        button = BGUI.Button.CreateImageOnlyButton("but", "./assets/2D/UI/button_back@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.height="100px";
        button.width="100px";
        button.left = 100;
        button.top = 50;
        button.thickness = 0;
        this._panel.addControl(button);

        button = BGUI.Button.CreateImageOnlyButton("but", "./assets/2D/UI/button_a@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.height="60px";
        button.width="60px";
        button.left = -50;
        button.top = 30;
        button.thickness = 0;
        this._panel.addControl(button);
        
        button = BGUI.Button.CreateImageOnlyButton("but", "./assets/2D/UI/button_b@2x.png");
        button.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.height="60px";
        button.width="60px";
        button.left = 50;
        button.top = 30;
        button.thickness = 0;
        this._panel.addControl(button);

        this.show(false);
    }

    private createLevelVariablesGrid():BGUI.Grid{
        
        // Make a Form for Level Variables:
        let totalRows = this.data.Variables.length + this.data.SpaceAfterVariables.length
        let lvGrid = GridHelper.createGrid(totalRows, 2, null, [0.5], [0.6, 0.4]);
        lvGrid.paddingLeft = lvGrid.paddingRight = 0;
        lvGrid.width = 1;
        lvGrid.height = 1;

        let row;
        let varID=0;
        let spaces = this.data.SpaceAfterVariables.slice(0) // clone the array
        let next_space = spaces.shift() // pop the first element
        for(row = 0; row < totalRows; row++){
            if(next_space == (varID-1) ){
                next_space = spaces.shift();
                
                continue;
            }
            else {
                let description = BGUI.Button.CreateSimpleButton('Var'+varID, this.data.Variables[varID].Name)
                description.color = '#000000';
                description.thickness = 0;

                lvGrid.addControl(description, row, 0)
                lvGrid.addControl(new ValueSelector(this.data.Variables[varID]), row, 1);
                varID += 1;
            }
        }
        return lvGrid;
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

class ValueSelector extends BGUI.Container {
    public ID:number=-1;
    isBoolean:boolean=false;
    buttonUp:BGUI.Button;
    buttonDown:BGUI.Button;
    varText:BGUI.TextBlock;
    buttonSize:string = "1";
    private minValue:number=0;
    private maxValue:number=10;
    private stepValue:number=1;
    private _varValue:number = 0;
	get varValue():number {
	  	return this._varValue;
    }
    set varValue(newValue:number) {
        	
        if(newValue > this.maxValue){
            this._varValue = this.maxValue;
        } 
        else if(newValue < this.minValue){
            this._varValue = this.minValue;
        }
        // else if (stepValue != 0){
        // 	if ((newValue % stepValue) != 0) 
        // 		this._varValue = (newValue/stepValue) * stepValue;
        // } 
        else {
            this._varValue = newValue;
        }

        this.varText.text = this.translateToText(this._varValue);
    }
	
    constructor(varData:LevelVariableData){
        super();
        this.buttonUp = BGUI.Button.CreateImageOnlyButton("but", "assets/2D/UI/small_arrow_right@2x.png");
        this.buttonUp.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.buttonUp.width = this.buttonSize/5;
        this.buttonUp.height = this.buttonSize;
        this.buttonUp.alpha = 0.7;
        this.buttonUp.thickness = 0;
        
        this.buttonDown = BGUI.Button.CreateImageOnlyButton("but", "assets/2D/UI/small_arrow_left@2x.png");
        this.buttonDown.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.buttonDown.width = this.buttonSize/5;
        this.buttonDown.height = this.buttonSize;
        this.buttonDown.alpha = 0.7;
        this.buttonDown.thickness = 0;
        
        this.varText = new BGUI.TextBlock();
        this.varText.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.varText.text = "NA";
        this.varText.color = "#057690";
        this.varText.fontSize = "24px";

        this.addControl(this.buttonUp);
        this.addControl(this.buttonDown);
        this.addControl(this.varText);

        this.populate(varData);

    }

    public populate(varData:LevelVariableData){
        this.ID = varData.ID;
        this.minValue = varData.MinValue;
        this.maxValue = varData.MaxValue;
        this.stepValue = varData.StepValue;
        this.isBoolean = (this.minValue == 0 && this.maxValue == 1)? true : false;
        this.varValue = varData.MinValue;
    }

    private translateToText(value:number):string {
        if(value === undefined)
            return "NA";
		if(this.isBoolean){
			return value == 0? "No" : "Yes";
		} else {
			return value.toString();
		}
		
	}

	public increment(){
		this.varValue += this.stepValue;

	}

	public decrement(){
		this.varValue -= this.stepValue;
		
	}
}