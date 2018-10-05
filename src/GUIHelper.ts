import * as BGUI from 'babylonjs-gui';
export class GridHelper {
    static createGrid(nrow:number, ncol:number, cellObject?:(BGUI.Control|null)[]|null, 
        rowsizes?:number[], colsizes?:number[]) : BGUI.Grid {
    
        if(cellObject === undefined){ 
            // if the user does not specify 
            // we provide a default object to fill the grid and make it visible
            // user can use "null" to get an empty grid.
            let rect = new BGUI.Rectangle();
            rect.background = "white";
            rect.color = "black";
            rect.cornerRadius = 20;
            rect.thickness = 1;
            cellObject = [rect];
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
        
        if(cellObject===null)
            return grid;
        
        let index = 0;
        for (row = 0; row < nrow; row++){
            for (col = 0; col < ncol; col++){
                index = (row*ncol+col%ncol) % cellObject.length;
                if(cellObject[index] !== null)
                    grid.addControl(cellObject[index], row, col);     
            }
        }
        return grid
    }
} 