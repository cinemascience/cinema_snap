import React, {useState, useEffect} from 'react';
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import ItemTypes from './ItemTypes'
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './App.css';

function DropView(props){

	const [dataRevision, updateDataRevision] = useState(0);
	const data_revision = 0;

	const [{ isOver }, drop] = useDrop({
		accept: [ItemTypes.PARALLELCOORD, 
			ItemTypes.XYGRAPH,
			ItemTypes.IMAGE,
			ItemTypes.PVCHART,
			ItemTypes.LATTICEVSTIME,
			ItemTypes.CONTOURDIAGRAM],
		drop: item => dropped(item, props.cls, props.viewUpdater, props.selectedViews),
		collect: monitor => ({
			isOver: !!monitor.isOver()
		}),
	})

	
			
	switch(props.selectedViews[props.cls]){
		case "image":
			if(typeof props.csvData === "undefined"){
				return (
					<div
					ref={drop}
					style={{
						backgroundColor: isOver ? "green" : "cyan",
					}}
					className={props.cls}
					>	
						No database has been connected
					</div>
				);
			}
			return (
				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<TransformWrapper>
						<TransformComponent>
							<img className="xrdImage" src={"http://" + 
								props.connectAddress + 
								"/" + 
								props.csvData[props.selectedData]["FILE_image_path"]} 
							alt=""/>
						</TransformComponent>
					</TransformWrapper>
					
				</div>
			);
		case "xyGraph":
			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={props.finalDataset.xyTraces}
						layout={ {title: 'Intensity vs. Angle plot',
								autosize: true,
								datarevision: props.dataRevision,
								uirevision: 1,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: 'X-ray Diffraction Angle',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Intensity',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						revision="0"
						style={ {height:"100%",width:"100%"} }
						onClick={(e) => props.selectedDataUpdater(e.points[0].curveNumber)}
					/>
				</div>
			);
			
		case "pvChart":
			
			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={props.finalDataset.pvTraces}
						layout={ {title: 'Pressure vs. Volume plot',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: 'Pressure',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Volume',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		case "latticeVSTime":
			
			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={props.finalDataset.ltTraces}
						layout={ {title: 'Lattice vs. Time plot',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: 'Time',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Lattice Constant',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		case "contourDiagram":

			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={props.finalDataset.conTraces}
						layout={ {title: 'Contour Diagram',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},
								  xaxis: {
								    title: {
								      text: 'X-ray Diffraction Angle',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Shot number',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		default:
			return (
				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>	
					{props.selectedViews[props.cls]}
				</div>
			);
	}
}


export default DropView;
